import numpy as np
from datetime import datetime, timedelta, time
import json
import calendar
import pandas as pd
import sys

def add_to_calendar(json_input, calendario):
    # medicamento,frecuencia,dias,primera_toma
    # Puedo asumir que primera_toma = '08:30' (ie, un str de la forma 'hh:mm') (si pongo los datos de entrada por separado)??
    '''
    La función add_to_calendar genera una lista de fechas completas con formato
    TIMESTAMP (aaaa-MM-dd hh:mm:ss) correspondientes a las tomas del medicamento dado
    como valor de entrada, y las añade a tu 'calendario'.

    Parámetros:
    - json_input es un objeto json con las siguientes etiquetas:
      · medicamento (str): Nombre del medicamento.
      · frecuencia (str to int): Frecuencia en horas entre tomas del medicamento.
      · dias (str to int): Número total de días para el tratamiento.
      · primera_toma (str): Hora de la primera toma en formato 'hh:mm'.

    - calendario (dict): Calendario existente donde se almacenarán las fechas de toma.

    Ejemplo de uso:
    add_to_calendar(json_input, calendario)
    '''
    # Transformo el input json a un diccionario
    json_dic = json.loads(json_input)

    # Extraigo la información del "diccionario json"
    #json_dic = json_input
    medicamento = json_dic['medicamento']
    frecuencia = json_dic['frecuencia']
    dias = json_dic['dias']
    primera_toma = json_dic['primera_toma']

    # 1º Redefinir los formatos
    frecuencia = int(frecuencia)
    dias = int(dias)
    primera_toma = datetime(datetime.now().year,datetime.now().month,datetime.now().day,int(primera_toma[0:2]),int(primera_toma[3:]),0)
    # -> Establezco la primera toma como el día de hoy, a la hora dada de entrada

    # 2º Crear la lista de fechas de toma del medicamento
    lista_fechas = []
    numero_pastis = int(dias*24/frecuencia)
    # -> Calculo el número total de tomas del medicamento
    fecha = primera_toma
    # -> Fijo la fecha de la primera toma de como partida (para añadir tomas a partir de ella)

    for _ in range(numero_pastis-1): # Nota: resto 1 porque asumo que ya ha hecho la primera toma
        fecha += timedelta(hours=frecuencia)
        # Antes de guardar la fecha con formato datetime(aaaa, MM, dd, hh, mm), 
         # pasarla a formato TIMESTAMP: string 'aaaa-MM-ddTHH:mm:ss'

        fecha_T = fecha.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        # NOTA: he visto que la T se pone para separar fecha/hora, pero se puede quitar!!
        lista_fechas.append(fecha_T)

    # 3º Actualizar el 'calendario'
    calendario[medicamento] = lista_fechas
  
# EJEMPLO DE USO
# Inicializo la variable 'calendario'
# Nota: 'calendario' puede estar vacío (si es la primera interacción), o tener tus datos históricos
calendario = {}

# Actualizo el calendario con un varios medicamentos: [inputs: (json, calendario)]
#json1 = json.dumps({'medicamento':'ibuprofeno', 'frecuencia':'8', 'dias':'2', 'primera_toma':'07:00'}, indent=4, ensure_ascii=False)
#json2 = json.dumps({'medicamento':'paracetamol', 'frecuencia':'6', 'dias':'1', 'primera_toma':'20:00'}, indent=4, ensure_ascii=False)
#json3 = json.dumps({'medicamento':'amoxicilina', 'frecuencia':'12', 'dias':'2', 'primera_toma':'10:30'}, indent=4, ensure_ascii=False)

json_input = sys.argv[1]
#result_date = json.dumps(calendario, indent=4, ensure_ascii=False)
add_to_calendar(json_input, calendario)
print(json.dumps(calendario, indent=4, ensure_ascii=False))
#result_date = json.dumps(calendario, indent=4, ensure_ascii=False)

#add_to_calendar(json2, calendario)
#add_to_calendar(json3, calendario)

# Comprobamos si el 'calendario-pastillero' se ha actualizado
#print(calendario)