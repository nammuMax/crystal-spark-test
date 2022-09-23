<?php

use App\Sandra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//...

// START OF ADDED BY MAX LEROUX FOR TEST

Route::middleware('cors')->get("testgame/cities",'TestGameController@getCities');
Route::middleware('cors')->get("testgame/cities/{name}/translations",'TestGameController@getCityTranslations');
Route::middleware('cors')->post("testgame/cities/{name}/translations",'TestGameController@updateCityTranslation');
Route::middleware('cors')->get("testgame/cities/{name}/country",'TestGameController@getCityCountry');
Route::middleware('cors')->post("testgame/cities/{name}/country",'TestGameController@updateCityCountry');

Route::middleware('cors')->get("testgame/countries",'TestGameController@getCountries');

// END OF ADDED BY MAX LEROUX FOR TEST

// ...

