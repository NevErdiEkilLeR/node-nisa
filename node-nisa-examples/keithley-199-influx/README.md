
## Keithley 199 & Internet of things
This is an example for module node-nisa, demonstrating how a 25 years old instrument talking over 50 years old protocol can store measurements in the hip database for internet of things: [InfluxDB](https://influxdb.com/). Seriously, if you want to store a whole lot of measurements, InfluxDB is much better then either regular SQL or plain CSV file.

# Installation and usage
Check the GPIB address of your Keihtley 199 and change the appropriate number in source (line 6). Edit address of your InfluxDB and run with ``` npm run start ```