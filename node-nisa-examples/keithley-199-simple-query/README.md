## Keithley 199 simple query
This is an example for module node-nise, demonstrating simple querying of Keithley 199. Keithley 199 is an ancient bench multimeter with GPIB interface. 

The example here sets it up on mV range and then queries it every 250ms. The results are routed to standard deviation library and everything is displayed on console. 

If the input of the multimeter is overloaded (>3V applied to input), the multimeter will emit an SRQ event (this is enabled by sending GPIB DDC command ``` M1 ``` ). SRQ is shorthand for "service request". 

# Installation
Check the GPIB address of your Keihtley 199 and change the appropriate number in source (line 6).

Run with ``` npm run start ```

