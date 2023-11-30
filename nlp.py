import nltk
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('universal_tagset', quiet=True)

import re
import json
from nltk.corpus import stopwords
from nltk import sent_tokenize
from nltk.tokenize import word_tokenize
from nltk import pos_tag
import sys

def tokenizar_texto(texto):

  # Obtener las stopwords en español
  stopwords_spanish = set(stopwords.words('spanish'))

  # Palabras personalizadas a excluir
  palabras_a_excluir = {'un', 'una'}  # Agrega aquí las palabras que deseas excluir

  # Crear un nuevo conjunto de stopwords excluyendo las palabras personalizadas
  stopwords_actualizadas = stopwords_spanish - palabras_a_excluir

  # Tokenizar el texto
  palabras_texto = word_tokenize(texto, language='spanish')

  # Filtrar palabras utilizando las nuevas stopwords
  palabras_filtradas = [palabra for palabra in palabras_texto if palabra.lower() not in stopwords_actualizadas]

  return palabras_filtradas

# Obtener medicamento, frecuencia y duración

medicamentos = [
'acetilcisteina',
'adiro',
'amoxicilina',
'cetirizina',
'azitromicina',
'diazepam',
'enantyum',
'eutirox',
'ibuprofeno',
'lorazepam',
'metformina',
'nolotil',
'omeprazol',
'orfidal',
'parecetamol',
'sintrom',
'tramadol',
'vancomicina',
'ventolin'
]

horas = {
    'cada':1,'una':1,'dos':2,'tres':3,'cuatro':4,'cinco':5,'seis':6,
    'siete':7,'ocho':8,'nueve':9,'diez':10,'once':11,'doce':12,
    'trece':13,'veinticuatro':24,'cuarentaiocho':48
}

dias = {
    'cada':1,'un':1,'una':1,'dos':2,'tres':3,'cuatro':4,'cinco':5,'seis':6,
    'siete':7,'ocho':8,'nueve':9,'diez':10,'once':11,'doce':12,
    'trece':13,'veinte':20,'veinticuatro':24,'cuarentaiocho':48
}

datos_tiempo = ['meses','días','día','mes','semana','semanas']

def obtener_datos(medicamentos,horas,dias,palabras_filtradas):
  primera_dosis = ""
  medicamento = ""
  frecuencia = 0
  duracion = 0
  for i, palabra in enumerate(palabras_filtradas):
      if palabra.lower() in medicamentos:
          #print("NUEVA ENTRADA:\n")
          medicamento = palabra.capitalize()
          #print("Medicamento encontrado:", medicamento)

      elif palabra in horas and i < len(palabras_filtradas) - 1 and palabras_filtradas[i + 1] in ['horas','hora','día']:
          if palabras_filtradas[i + 1] == "horas":
              frecuencia = horas[palabra]
              #print("Frecuencia encontrada:", frecuencia, "horas")

          elif palabras_filtradas[i + 1] == "hora":
              frecuencia = horas[palabra]
              #print("Frecuencia encontrada:", frecuencia, "hora")

          elif palabras_filtradas[i] and palabras_filtradas[i + 1] == "día":
              frecuencia = horas[palabra] * 24
              #print("Frecuencia encontrada:", frecuencia, "horas")

      elif palabra in dias and palabras_filtradas[i + 1] and i < len(palabras_filtradas) - 1 and palabras_filtradas[i + 1] in datos_tiempo:
              duracion = dias[palabra]

              if palabras_filtradas[i + 1] in ["día"]:
                duracion = dias[palabra]
                #print("Duración encontrada:", duracion, "horas")

              else:
                if palabras_filtradas[i + 1] in ["días"]:
                  duracion = dias[palabra]

                elif palabras_filtradas[i + 1] in ["semana", "semanas"]:
                    duracion *= 7  # Convertir semanas a días

                elif palabras_filtradas[i + 1] in ["mes", "meses"]:
                    duracion *= 30  # Convertir semanas a días

                #print("Duración encontrada:", duracion, "días")

      elif palabra == "primera" and palabras_filtradas[i + 1] == "dosis":
            pass

  if duracion == 0:
                duracion = 30
                #print("Frecuencia encontrada:", frecuencia, "horas")
  if frecuencia == 0:
                frecuencia = 24
                #print("Frecuencia encontrada:", frecuencia, "horas")
  if primera_dosis == "":
                primera_dosis = "16:00"
                #print("Primera dosis encontrada:", primera_dosis)

  return medicamento,frecuencia,duracion,primera_dosis

texto = sys.argv[1]
palabras_filtradas = tokenizar_texto(texto)
medicamento,frecuencia,duracion,primera_dosis = obtener_datos(medicamentos,horas,dias,palabras_filtradas)

datos = {"medicamento": medicamento,
      "frecuencia": frecuencia,
      "dias": duracion,
      "primera_toma":primera_dosis}

# Convertir a JSON y mostrar
json_data = json.dumps(datos, indent=4, ensure_ascii=False)
print(json_data)