
## Keithley 199 acquire data on SRQ event 
This is an example for module node-nisa, demonstrating how to use the SRQ emitting functionaliy. The instrument has a local storage memory and we can direct it to run measurements on predefined interval. It can also use scanner (if attached). When instrument memory is full, it will emit an SRQ event with bit 2 (Data store full) set. After that we can gather data. 
This example also demonstrates how to trigger the instrument to do something (pull ATN low, GET command byte.. but everything is really done by underlying VISA viAssertTrigger.. we're just wrapping the call).

# Installation and usage
Check the GPIB address of your Keihtley 199 and change the appropriate number in source (line 6). 