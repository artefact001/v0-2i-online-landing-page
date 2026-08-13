<?php
// app/Http/Controllers/BictorysController.php

namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\Paiement;
use App\Services\BictorysService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BictorysController extends Controller
{
    public function __construct(protected BictorysService $bictorys)
    {
    }

    /**
     * POST /v1/paiements/{paiement}/bictorys  (protégée, auth:sanctum)
     * Initie une charge Bictorys pour un paiement déjà créé (via POST
     * /v1/paiements côté frontend) et renvoie l'URL de paiement hébergée
     * vers laquelle rediriger l'utilisateur.
     */
    public function initiate(Request $request, Paiement $paiement)
    {
        if ($paiement->student_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        if ($paiement->status === 'completed') {
            return response()->json(['success' => false, 'message' => 'Ce paiement est déjà finalisé'], 422);
        }

        // Référence unique et stable pour retrouver ce paiement depuis le
        // webhook Bictorys (paymentReference aller-retour).
        $reference = $paiement->payment_reference;
        if (!$reference) {
            $reference = (string) Str::uuid();
            $paiement->update(['payment_reference' => $reference]);
        }

        $frontendUrl = rtrim(config('app.frontend_url', 'https://www.2i-online.com'), '/');
        $user = $request->user();

        try {
            $charge = $this->bictorys->createCheckoutCharge([
                'amount' => (int) round($paiement->amount),
                'currency' => $paiement->currency ?? 'XOF',
                'paymentReference' => $reference,
                'merchantReference' => (string) $paiement->id,
                'successRedirectUrl' => "{$frontendUrl}/payment/success?paiement_id={$paiement->id}",
                'errorRedirectUrl' => "{$frontendUrl}/payment/error?paiement_id={$paiement->id}",
                'customerObject' => [
                    'name' => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'country' => 'SN',
                    'locale' => 'fr-FR',
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('[Bictorys] Échec création charge', ['error' => $e->getMessage(), 'paiement_id' => $paiement->id]);
            return response()->json(['success' => false, 'message' => "Erreur lors de l'initialisation du paiement"], 502);
        }

        $checkoutUrl = $this->bictorys->extractCheckoutUrl($charge);

        if (!$checkoutUrl) {
            Log::warning('[Bictorys] Impossible de trouver l\'URL de paiement dans la réponse', ['response' => $charge]);
            return response()->json([
                'success' => false,
                'message' => 'Réponse Bictorys inattendue (voir les logs Laravel)',
            ], 502);
        }

        return response()->json([
            'success' => true,
            'data' => ['checkout_url' => $checkoutUrl],
        ]);
    }

    /**
     * POST /v1/webhooks/bictorys  (PUBLIQUE — hors auth:sanctum)
     * Bictorys appelle cette route directement depuis leurs serveurs pour
     * confirmer le statut final d'une transaction.
     */
    public function webhook(Request $request)
    {
        $secretHeader = $request->header('X-Secret-Key');

        if (!$secretHeader || $secretHeader !== config('services.bictorys.webhook_secret')) {
            Log::warning('[Bictorys webhook] Clé secrète invalide ou manquante');
            return response()->json(['message' => 'Invalid secret'], 401);
        }

        $payload = $request->all();
        $status = strtolower($payload['status'] ?? '');
        $reference = $payload['paymentReference'] ?? null;

        if (!$reference) {
            return response()->json(['message' => 'Missing paymentReference'], 400);
        }

        $paiement = Paiement::where('payment_reference', $reference)->first();

        if (!$paiement) {
            Log::warning('[Bictorys webhook] Paiement introuvable pour la référence', ['reference' => $reference]);
            return response()->json(['message' => 'Paiement introuvable'], 404);
        }

        // Idempotence: si déjà traité, on répond 200 sans rien refaire.
        if ($paiement->status === 'completed') {
            return response()->json(['success' => true]);
        }

        if (in_array($status, ['succeeded', 'authorized'], true)) {
            $paiement->update([
                'status' => 'completed',
                'provider_transaction_id' => $payload['id'] ?? null,
                'paid_at' => now(),
            ]);

            if ($paiement->enrollment_id) {
                Inscription::where('id', $paiement->enrollment_id)->update([
                    'status' => 'active',
                    'payment_status' => 'completed',
                ]);
            }
        } elseif ($status === 'failed') {
            $paiement->update(['status' => 'failed']);
        }
        // Autres statuts (pending, etc.) : on ne fait rien de spécial, on
        // attend un prochain webhook avec un statut final.

        return response()->json(['success' => true]);
    }
}
