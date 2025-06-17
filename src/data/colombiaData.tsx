// src/data/colombiaData.tsx

export interface Ciudad {
  nombre: string;
  codigo: string;
}

export interface Departamento {
  nombre: string;
  codigo: string;
  ciudades: Ciudad[];
}

export const departamentosColombia: Departamento[] = [
  {
    nombre: "Amazonas",
    codigo: "AMA",
    ciudades: [
      { nombre: "Leticia", codigo: "LET" },
      { nombre: "Puerto Nariño", codigo: "PNA" }
    ]
  },
  {
    nombre: "Antioquia",
    codigo: "ANT",
    ciudades: [
      { nombre: "Medellín", codigo: "MED" },
      { nombre: "Bello", codigo: "BEL" },
      { nombre: "Envigado", codigo: "ENV" },
      { nombre: "Itagüí", codigo: "ITA" },
      { nombre: "Rionegro", codigo: "RIO" }
    ]
  },
  {
    nombre: "Atlántico",
    codigo: "ATL",
    ciudades: [
      { nombre: "Barranquilla", codigo: "BAQ" },
      { nombre: "Soledad", codigo: "SOL" },
      { nombre: "Malambo", codigo: "MAL" }
    ]
  },
  {
    nombre: "Bogotá D.C.",
    codigo: "BOG",
    ciudades: [
      { nombre: "Bogotá", codigo: "BOG" }
    ]
  },
  {
    nombre: "Bolívar",
    codigo: "BOL",
    ciudades: [
      { nombre: "Cartagena", codigo: "CTG" },
      { nombre: "Magangué", codigo: "MAG" },
      { nombre: "Turbaco", codigo: "TUR" }
    ]
  },
  {
    nombre: "Boyacá",
    codigo: "BOY",
    ciudades: [
      { nombre: "Tunja", codigo: "TUN" },
      { nombre: "Duitama", codigo: "DUI" },
      { nombre: "Sogamoso", codigo: "SOG" }
    ]
  },
  {
    nombre: "Caldas",
    codigo: "CAL",
    ciudades: [
      { nombre: "Manizales", codigo: "MZL" },
      { nombre: "Chinchiná", codigo: "CHI" },
      { nombre: "La Dorada", codigo: "LDO" }
    ]
  },
  {
    nombre: "Caquetá",
    codigo: "CAQ",
    ciudades: [
      { nombre: "Florencia", codigo: "FLA" },
      { nombre: "San Vicente del Caguán", codigo: "SVC" }
    ]
  },
  {
    nombre: "Casanare",
    codigo: "CAS",
    ciudades: [
      { nombre: "Yopal", codigo: "YOP" },
      { nombre: "Aguazul", codigo: "AGU" },
      { nombre: "Villanueva", codigo: "VIL" }
    ]
  },
  {
    nombre: "Cauca",
    codigo: "CAU",
    ciudades: [
      { nombre: "Popayán", codigo: "POP" },
      { nombre: "Santander de Quilichao", codigo: "SDQ" }
    ]
  },
  {
    nombre: "Cesar",
    codigo: "CES",
    ciudades: [
      { nombre: "Valledupar", codigo: "VUP" },
      { nombre: "Aguachica", codigo: "AGU" }
    ]
  },
  {
    nombre: "Chocó",
    codigo: "CHO",
    ciudades: [
      { nombre: "Quibdó", codigo: "QUI" },
      { nombre: "Istmina", codigo: "IST" }
    ]
  },
  {
    nombre: "Córdoba",
    codigo: "COR",
    ciudades: [
      { nombre: "Montería", codigo: "MTR" },
      { nombre: "Cereté", codigo: "CER" },
      { nombre: "Lorica", codigo: "LOR" }
    ]
  },
  {
    nombre: "Cundinamarca",
    codigo: "CUN",
    ciudades: [
      { nombre: "Zipaquirá", codigo: "ZIP" },
      { nombre: "Facatativá", codigo: "FAC" },
      { nombre: "Chía", codigo: "CHI" },
      { nombre: "Mosquera", codigo: "MOS" },
      { nombre: "Soacha", codigo: "SOA" }
    ]
  },
  {
    nombre: "Guainía",
    codigo: "GUA",
    ciudades: [
      { nombre: "Inírida", codigo: "INI" }
    ]
  },
  {
    nombre: "Guaviare",
    codigo: "GUV",
    ciudades: [
      { nombre: "San José del Guaviare", codigo: "SJG" }
    ]
  },
  {
    nombre: "Huila",
    codigo: "HUI",
    ciudades: [
      { nombre: "Neiva", codigo: "NEI" },
      { nombre: "Pitalito", codigo: "PIT" },
      { nombre: "Garzón", codigo: "GAR" }
    ]
  },
  {
    nombre: "La Guajira",
    codigo: "LAG",
    ciudades: [
      { nombre: "Riohacha", codigo: "RIO" },
      { nombre: "Maicao", codigo: "MAI" },
      { nombre: "Uribia", codigo: "URI" }
    ]
  },
  {
    nombre: "Magdalena",
    codigo: "MAG",
    ciudades: [
      { nombre: "Santa Marta", codigo: "SMR" },
      { nombre: "Ciénaga", codigo: "CIE" },
      { nombre: "Fundación", codigo: "FUN" }
    ]
  },
  {
    nombre: "Meta",
    codigo: "MET",
    ciudades: [
      { nombre: "Villavicencio", codigo: "VVC" },
      { nombre: "Acacías", codigo: "ACA" },
      { nombre: "Granada", codigo: "GRA" }
    ]
  },
  {
    nombre: "Nariño",
    codigo: "NAR",
    ciudades: [
      { nombre: "Pasto", codigo: "PSO" },
      { nombre: "Ipiales", codigo: "IPI" },
      { nombre: "Tumaco", codigo: "TCO" }
    ]
  },
  {
    nombre: "Norte de Santander",
    codigo: "NSA",
    ciudades: [
      { nombre: "Cúcuta", codigo: "CUC" },
      { nombre: "Ocaña", codigo: "OCA" },
      { nombre: "Pamplona", codigo: "PAM" }
    ]
  },
  {
    nombre: "Putumayo",
    codigo: "PUT",
    ciudades: [
      { nombre: "Mocoa", codigo: "MOC" },
      { nombre: "Puerto Asís", codigo: "PAS" }
    ]
  },
  {
    nombre: "Quindío",
    codigo: "QUI",
    ciudades: [
      { nombre: "Armenia", codigo: "ARM" },
      { nombre: "Calarcá", codigo: "CAL" },
      { nombre: "Montenegro", codigo: "MON" }
    ]
  },
  {
    nombre: "Risaralda",
    codigo: "RIS",
    ciudades: [
      { nombre: "Pereira", codigo: "PER" },
      { nombre: "Dosquebradas", codigo: "DOS" },
      { nombre: "Santa Rosa de Cabal", codigo: "SRC" }
    ]
  },
  {
    nombre: "San Andrés y Providencia",
    codigo: "SAP",
    ciudades: [
      { nombre: "San Andrés", codigo: "ADZ" },
      { nombre: "Providencia", codigo: "PVA" }
    ]
  },
  {
    nombre: "Santander",
    codigo: "SAN",
    ciudades: [
      { nombre: "Bucaramanga", codigo: "BGA" },
      { nombre: "Floridablanca", codigo: "FLO" },
      { nombre: "Girón", codigo: "GIR" },
      { nombre: "Piedecuesta", codigo: "PIE" },
      { nombre: "Barrancabermeja", codigo: "BAR" }
    ]
  },
  {
    nombre: "Sucre",
    codigo: "SUC",
    ciudades: [
      { nombre: "Sincelejo", codigo: "SIN" },
      { nombre: "Corozal", codigo: "COR" }
    ]
  },
  {
    nombre: "Tolima",
    codigo: "TOL",
    ciudades: [
      { nombre: "Ibagué", codigo: "IBE" },
      { nombre: "Espinal", codigo: "ESP" },
      { nombre: "Melgar", codigo: "MEL" }
    ]
  },
  {
    nombre: "Valle del Cauca",
    codigo: "VAC",
    ciudades: [
      { nombre: "Cali", codigo: "CLO" },
      { nombre: "Buenaventura", codigo: "BUN" },
      { nombre: "Palmira", codigo: "PMI" },
      { nombre: "Tuluá", codigo: "TUL" },
      { nombre: "Buga", codigo: "BGA" }
    ]
  },
  {
    nombre: "Vaupés",
    codigo: "VAU",
    ciudades: [
      { nombre: "Mitú", codigo: "MIT" }
    ]
  },
  {
    nombre: "Vichada",
    codigo: "VIC",
    ciudades: [
      { nombre: "Puerto Carreño", codigo: "PCR" }
    ]
  }
];