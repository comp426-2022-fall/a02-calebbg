#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

// Get arguments
const args = minimist(process.argv.slice(2));

// Print help message if requested
if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE

        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.
    `);
    process.exit(0);
}

// Get timezone from moment-timezone or from argument
var timezone = moment.tz.guess();
if (args.z) {
    timezone = args.z;
}

// Get latitude from argument
var latitude = 35.875;
if (args.n) {
    latitude = args.n;
}
else if (args.s) {
    latitude = -Math.abs(args.s);
}
latitude = latitude.toFixed(2);

// Get longitude from argument
var longitude = -79;
if (args.e) {
    longitude = args.e;
}
else if (args.w) {
    longitude = -Math.abs(args.w);
}
longitude = longitude.toFixed(2);


// Build url with variables
const base_url = "https://api.open-meteo.com/v1/forecast";

const data_string = "latitude=" + latitude + "&longitude=" + longitude + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=" + timezone;

const url = base_url + "?" + data_string;

// Fetch data with url
const response = await fetch(url);

const data = await response.json();

// Print data and exit if -j argument used
if (args.j) {
    console.log(data);
    process.exit(0);
}

// Get days argument and concat appropriate messages
var day = 1;
if (args.d) {
    day = args.d;
}
if (args.d==0) {
    day = 0;
}

if (data.daily.precipitation_hours[day] > 0) {
    process.stdout.write("You might need your galoshes ");
}
else {
    process.stdout.write("You probably won't need your galoshes ")
}

if (day == 0) {
  console.log("today.");
} else if (day > 1) {
  console.log("in " + day + " days.");
} else {
  console.log("tomorrow.");
}