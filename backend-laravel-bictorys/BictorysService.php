<?php
// app/Services/BictorysService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class BictorysService
{
    /**
     * Crée une charge en mode "Checkout" (page hébergée Bictorys, l'utilisateur
     * choisit Mobile Money ou Carte sur leur page). On n'envoie PAS de
     * payment_type en query string — c'est ce qui déclenche le mode Checkout
     * plutôt que le mode Direct API.
     */
    public function createCheckoutCharge(array $data): array
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Api-Key' => config('services.bictorys.public_key'),
        ])->post(config('services.bictorys.base_url') . '/pay/v1/charges', $data);

        if (!$response->successful()) {
            throw new RuntimeException(
                'Bictorys charge creation failed (HTTP ' . $response->status() . '): ' . $response->body()
            );
        }

        return $response->json() ?? [];
    }

    /**
     * Extrait l'URL de paiement de la réponse Bictorys.
     * ATTENTION: le nom exact du champ n'a pas pu être confirmé dans la
     * documentation publique consultée. On teste plusieurs noms plausibles.
     * Si aucun ne correspond, log la réponse brute pour inspection manuelle
     * et ajuste cette liste en conséquence.
     */
    public function extractCheckoutUrl(array $response): ?string
    {
        foreach (['link', 'checkoutUrl', 'url', 'paymentUrl', 'redirectUrl'] as $key) {
            if (!empty($response[$key]) && is_string($response[$key])) {
                return $response[$key];
            }
        }

        return null;
    }
}
