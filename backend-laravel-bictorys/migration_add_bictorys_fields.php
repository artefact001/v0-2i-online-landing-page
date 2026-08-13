<?php
// database/migrations/xxxx_xx_xx_add_bictorys_fields_to_paiements_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paiements', function (Blueprint $table) {
            // Référence unique générée par notre app, envoyée à Bictorys en
            // "paymentReference" et renvoyée telle quelle dans le webhook —
            // c'est ce qui permet de retrouver le bon paiement.
            if (!Schema::hasColumn('paiements', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->unique()->after('id');
            }
            // Identifiant de transaction côté Bictorys (champ "id" du webhook).
            if (!Schema::hasColumn('paiements', 'provider_transaction_id')) {
                $table->string('provider_transaction_id')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('paiements', function (Blueprint $table) {
            $table->dropColumn(['payment_reference', 'provider_transaction_id']);
        });
    }
};
