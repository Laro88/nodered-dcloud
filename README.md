# DCloud NodeRED components
####  Starter
If you use this component then you know what its all about, otherwise you should find some other node-red stuff to play with :-)

#### on with the show
These components provice the interface for communicating with the DCloud publicapi and enables dicscovery, read, write and record values enabling devices to communicate using the publicapi.

The use of these components requires that you are registered on DCLoud, has api access, some device to communicate with, and knows the DCloud structure.

[DCloud](www.dcloud.dk)

## config (used inside Read and Write nodes)
The config component handles the server URL, manages credentials, components available and monitors the status of the DCloud.

## Read
Reads the latest values of one or more varids

## Write
Lets you write variables inside devices (prototype, use only if you know what you are doing or you might mess up the target device)

## GraphSlicer
Formats Read data to fit the Chart node in Dashboard

## Humanizer
Formats timespans in a human readable form. The intention is to show aging of dat ain the IoT world. It calls the humanize in the moment package.

### If You Are Submitting Bugs/Issues
Because we(I) can't magically know what you are doing to expose an issue, it is best if you provide a snippet of code. This snippet need not include your secret sauce, but it must replicate the issue you are describing. The issues that get closed without resolution tend to be the ones without code examples. Thanks.