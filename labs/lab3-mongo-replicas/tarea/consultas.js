// == A1: Sin índice (Explain inicial) ==
print("== A1 (Explain sin índice) ==");
printjson(
  db.eventos.find(
    {
      categoria: "concierto",
      ciudad: "Heredia",
      fecha: { $gte: "2026-12-01", $lte: "2027-02-28" }
    },
    { nombre: 1, recinto: 1, fecha: 1, _id: 0 }
  ).sort({ fecha: 1 }).explain("executionStats")
);

// == A1: Creación del índice compuesto ==
db.eventos.createIndex({ categoria: 1, ciudad: 1, fecha: 1 });

// == A1: Con índice (Explain final y resultados) ==
print("== A1 (Explain con índice) ==");
printjson(
  db.eventos.find(
    {
      categoria: "concierto",
      ciudad: "Heredia",
      fecha: { $gte: "2026-12-01", $lte: "2027-02-28" }
    },
    { nombre: 1, recinto: 1, fecha: 1, _id: 0 }
  ).sort({ fecha: 1 }).explain("executionStats")
);

print("== A1 (Resultados) ==");
db.eventos.find(
  {
    categoria: "concierto",
    ciudad: "Heredia",
    fecha: { $gte: "2026-12-01", $lte: "2027-02-28" }
  },
  { nombre: 1, recinto: 1, fecha: 1, _id: 0 }
).sort({ fecha: 1 }).forEach(printjson);


// == A2 =================================================================
print("== A2 ==");
db.eventos.find(
  {
    zonas: {
      $elemMatch: {
        nombre: "VIP",
        precio: { $lt: 48000 }
      }
    }
  },
  {
    nombre: 1,
    zonas: { 
      $elemMatch: { nombre: "VIP" } 
    },
    _id: 0
  }
).forEach(printjson);

// == A2: Sin $elemMatch (Para comparar la cantidad de documentos) ==
print("== A2 Sin $elemMatch (Conteo) ==");
printjson(
  db.eventos.find(
    {
      "zonas.nombre": "VIP",
      "zonas.precio": { $lt: 48000 }
    },
    { nombre: 1, _id: 0 }
  ).itcount()
);


// == A3 =================================================================
print("== A3 ==");
db.eventos.find(
  {
    etiquetas: "accesible",
    categoria: { $nin: ["teatro", "conferencia"] }
  },
  { nombre: 1, categoria: 1, etiquetas: 1, _id: 0 }
).forEach(printjson);


// == A4 =================================================================
print("== A4 ==");
db.eventos.aggregate([
  { $match: { patrocinador: { $exists: false } } },
  { $group: { _id: "$categoria", total_sin_patrocinador: { $sum: 1 } } },
  { $sort: { total_sin_patrocinador: -1 } }
]).forEach(printjson);


// == A5 =================================================================
print("== A5 ==");
db.eventos.aggregate([
  { $unwind: "$zonas" },
  { 
    $group: { 
      _id: "$ciudad", 
      capacidad_total: { $sum: "$zonas.capacidad" } 
    } 
  },
  { $sort: { capacidad_total: -1 } }
]).forEach(printjson);
