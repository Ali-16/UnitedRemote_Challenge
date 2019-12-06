<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexToShops extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::collection('shops', function ($collection) {
            $collection->index(['location' => '2dsphere']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::collection('shops', function ($collection) {
            $collection->dropIndex(['location' => '2dsphere']);
        });
    }
}
