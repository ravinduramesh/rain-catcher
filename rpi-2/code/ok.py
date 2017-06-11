#!/usr/bin/python
import Adafruit_DHT
import json

h_check = 0
t_check = 0

while True:
    h, t = Adafruit_DHT.read_retry(11, 4)

    if h_check!=h or t_check!=t:
        h_check = h
        t_check = t
        print 'Temp: {0:0.1f} C  Humidity: {1:0.1f} %'.format(t, h)
        with open('data.json','a') as f:
            f_data = {"temp":t, "humidity":h}
            f.write(json.dumps(f_data))
