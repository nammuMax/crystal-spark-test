<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SandraCore\EntityFactory;
use SandraCore\System;

class TestGameController extends Controller
{
    public function getPeople(){

        $sandra = new System('testgame',true,env('DB_HOST'),env('DB_DATABASE'),
            env('DB_USERNAME'),env('DB_PASSWORD'));

        $peopleFactory = new EntityFactory('person','peopleFile',$sandra);
        $cityFactory = new EntityFactory('city','generalCityFile',$sandra);
        $peopleFactory->populateLocal();
        $peopleFactory->populateBrotherEntities();


        $peopleFactory->joinFactory('bornIn',$cityFactory);

        $antoine = $peopleFactory->last('firstName','Antoine');
        $arrayOfStrings = $antoine->getBrotherReference('bornInCity',null,'year');


        //assuming it has a born in city relation
        if (!empty($arrayOfEntities)){
            $bornIn = end($arrayOfEntities); //last entity of the array (it may have multiple bornInCity relation
           $bornYear = $bornIn->get('year'); // will return 1902
        }

        return $peopleFactory->dumpMeta();



    }


    // START OF ADDED BY MAX LEROUX FOR TEST
    public function getCities(){
        $sandra = new System('testgame',true,env('DB_HOST'),env('DB_DATABASE'),
            env('DB_USERNAME'),env('DB_PASSWORD'));

        // We get cities and populate them
        $cityFactory = new EntityFactory('city', 'generalCityFile', $sandra);
        $cityFactory->populateLocal();
        $cityFactory->populateBrotherEntities();

        return $cityFactory->dumpMeta();
    }

    public function getCityTranslations($name) {
        $sandra = new System('testgame',true,env('DB_HOST'),env('DB_DATABASE'),
            env('DB_USERNAME'),env('DB_PASSWORD'));

        $cityFactory = new EntityFactory('city', 'generalCityFile', $sandra);
        $cityFactory->populateLocal();
        $cityFactory->populateBrotherEntities();

        $city = $cityFactory->last('name', $name);

        $arrayOfEntities = $city->getBrotherEntitiesOnVerb('localizedFile');

        if (!empty($arrayOfEntities)) {
            return array_map(function($e) {
                $meta = $e->dumpMeta();
                $meta['references']['language'] = $e->targetConcept->getShortname(); // Couldn't find a nicer way to get the language string.
                return $meta;
            }, $arrayOfEntities);
        }
        else {
            return [];
        }
    }

    public function updateCityTranslation(Request $request, $name) {
        $sandra = new System('testgame', true, env('DB_HOST'), env('DB_DATABASE'),
            env('DB_USERNAME'), env('DB_PASSWORD'));

        $cityFactory = new EntityFactory('city', 'generalCityFile', $sandra);
        $cityFactory->populateLocal();
        $cityFactory->populateBrotherEntities();

        $body = $request->all();
        $city = $cityFactory->last('name', $name);

        // Update brother entity
        $city->setBrotherEntity('localizedFile', $body['language'], [ 'name' => $body['name'] ]);

        // Get new list of localizedFile entities
        $arrayOfEntities = $city->getBrotherEntitiesOnVerb('localizedFile');

        $response = [];

        if (!empty($arrayOfEntities)) {
            $response = array_map(function($e) {
                $meta = $e->dumpMeta();
                $meta['references']['language'] = $e->targetConcept->getShortname(); // Couldn't find a nicer way to get the language string.
                return $meta;
            }, $arrayOfEntities);
        }

        return [
            'error' => null,
            'data' => $response,
        ];
    }

    public function getCountries(){
        $sandra = new System('testgame',true,env('DB_HOST'),env('DB_DATABASE'),
            env('DB_USERNAME'),env('DB_PASSWORD'));

        // We get cities and populate them
        $cityFactory = new EntityFactory('country', 'generalCountryFile', $sandra);
        $cityFactory->populateLocal();
        $cityFactory->populateBrotherEntities();

        return $cityFactory->dumpMeta();
    }

    public function getCityCountry($name){
        $sandra = new System('testgame', true, env('DB_HOST'), env('DB_DATABASE'),
            env('DB_USERNAME'), env('DB_PASSWORD'));

        $cityFactory = new EntityFactory('city', 'generalCityFile', $sandra);
        $cityFactory->populateLocal();
        $cityFactory->populateBrotherEntities();

        $countryFactory = new EntityFactory('country', 'generalCountryFile', $sandra);
        $countryFactory->populateLocal();
        $countryFactory->populateBrotherEntities();

        $cityFactory->joinFactory('locatedIn', $countryFactory);
        $cityFactory->joinPopulate();

        $city = $cityFactory->last('name', $name);

        $country = $city->getJoinedEntities('locatedIn');
        $country = end($country);

        return [ 'country' => $country->get('name') ];
    }

    public function updateCityCountry(Request $request, $name) {
        $sandra = new System('testgame', true, env('DB_HOST'), env('DB_DATABASE'),
            env('DB_USERNAME'), env('DB_PASSWORD'));

        $cityFactory = new EntityFactory('city', 'generalCityFile', $sandra);
        $cityFactory->populateLocal();
        $cityFactory->populateBrotherEntities();

        $countryFactory = new EntityFactory('country', 'generalCountryFile', $sandra);
        $countryFactory->populateLocal();
        $countryFactory->populateBrotherEntities();

        $cityFactory->joinFactory('locatedIn', $countryFactory);
        $cityFactory->joinPopulate();

        $body = $request->all();

        $city = $cityFactory->last('name', $name);
        $country = $countryFactory->last('name', $body['country']);

        // Update located in
        $city->setJoinedEntity('locatedIn', $country, array());

        return [ 'error' => null ];
    }
    // END OF ADDED BY MAX LEROUX FOR TEST
}
