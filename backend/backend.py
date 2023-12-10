from flask import Flask, request, jsonify
import mysql.connector
import os
import uuid
import traceback
from flask_cors import CORS
from datetime import date
import requests

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password=os.environ.get("DB_PASS"),
  database="project2CS485"
)

globalCursor = db.cursor()

globalCursor.execute("DROP TABLE IF EXISTS `file_data`")

create_file_data_sql = """
CREATE TABLE file_data (
    id int NOT NULL AUTO_INCREMENT,
    filename varchar(255) NOT NULL,
    overall_tempo varchar(255) NOT NULL,
    peak1 varchar(255) NOT NULL,
    peak2 varchar(255) NOT NULL,
    PRIMARY KEY (id)
);
"""

globalCursor.execute(create_file_data_sql)

db.commit()
globalCursor.close()

@app.route('/api/store', methods=['POST'])
def store_file_data():
  try:
    filename = request.json["filename"]
    overall_tempo = request.json["overall_tempo"]
    peak1 = request.json["peak_1"]
    peak2 = request.json["peak_2"]

    cursor = db.cursor()
    db.commit()

    sql = "INSERT INTO file_data (filename, overall_tempo, peak1, peak2) VALUES (%s, %s, %s, %s)"
    values = (filename, overall_tempo, peak1, peak2)
    cursor.execute(sql, values)
    print(f"Inserted {values}")
    db.commit()

    response = {
      "status": "success"
    }
    return jsonify(response), 200
  except Exception as e:
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

@app.route('/api/get', methods=['GET'])
def get_file_data():
  cursor = db.cursor()
  db.commit()

  try:
    sql = "SELECT filename, overall_tempo, peak1, peak2 FROM file_data"
    cursor.execute(sql)
    file_datas = cursor.fetchall()
    db.commit()

    response = [{
      "filename": file_data[0],
      "overall_tempo": file_data[1],
      "peak1": file_data[2],
      "peak2": file_data[3]
    } for file_data in file_datas]
    return jsonify(response), 200
  except Exception as e:
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

if __name__ == "__main__":
  app.run(port=5000, debug=True)