// src/data/colombiaData.tsx

export interface Ciudad {
  nombre: string;
  codigo: string; // código DIVIPOLA (5 dígitos)
}

export interface Departamento {
  nombre: string;
  codigo: string; // código DIVIPOLA (2 dígitos)
  ciudades: Ciudad[];
}

export const departamentosColombia: Departamento[] = [
  { nombre: "Amazonas", codigo: "91", ciudades: [
      { nombre: "Leticia", codigo: "91001" },
      { nombre: "Puerto Nariño", codigo: "91540" },
      { nombre: "El Encanto", codigo: "91263" },
      { nombre: "La Chorrera", codigo: "91405" },
      { nombre: "La Pedrera", codigo: "91407" },
      { nombre: "La Victoria", codigo: "91430" },
      { nombre: "Mirití-Paraná", codigo: "91460" },
      { nombre: "Puerto Alegría", codigo: "91530" },
      { nombre: "Puerto Arica", codigo: "91536" },
      { nombre: "Puerto Santander", codigo: "91669" },
      { nombre: "Tarapacá", codigo: "91798" }
    ]
  },
  { nombre: "Antioquia", codigo: "05", ciudades: [
      { nombre: "Medellín", codigo: "05001" },
      { nombre: "Bello", codigo: "05088" },
      { nombre: "Envigado", codigo: "05266" },
      { nombre: "Itagüí", codigo: "05360" },
      { nombre: "Rionegro", codigo: "05615" },
      { nombre: "Apartadó", codigo: "05045" },
      { nombre: "Turbo", codigo: "05837" },
      { nombre: "Sabaneta", codigo: "05631" },
      { nombre: "Caldas", codigo: "05129" },
      { nombre: "Chigorodó", codigo: "05172" },
      { nombre: "Copacabana", codigo: "05212" },
      { nombre: "La Estrella", codigo: "05380" },
      { nombre: "Caucasia", codigo: "05154" },
      { nombre: "Girardota", codigo: "05308" },
      { nombre: "Necoclí", codigo: "05490" },
      { nombre: "Carepa", codigo: "05147" },
      { nombre: "Ciudad Bolívar", codigo: "05101" },
      { nombre: "Marinilla", codigo: "05440" },
      { nombre: "Santa Fe de Antioquia", codigo: "05042" },
      { nombre: "El Carmen de Viboral", codigo: "05148" }
    ]
  },
  { nombre: "Arauca", codigo: "81", ciudades: [
      { nombre: "Arauca", codigo: "81001" },
      { nombre: "Arauquita", codigo: "81591" },
      { nombre: "Saravena", codigo: "81736" },
      { nombre: "Tame", codigo: "81794" },
      { nombre: "Fortul", codigo: "81300" },
      { nombre: "Puerto Rondón", codigo: "81591" },
      { nombre: "Cravo Norte", codigo: "81220" }
    ]
  },
  { nombre: "Atlántico", codigo: "08", ciudades: [
      { nombre: "Barranquilla", codigo: "08001" },
      { nombre: "Soledad", codigo: "08758" },
      { nombre: "Malambo", codigo: "08421" },
      { nombre: "Sabanalarga", codigo: "08638" },
      { nombre: "Puerto Colombia", codigo: "08573" },
      { nombre: "Galapa", codigo: "08296" },
      { nombre: "Baranoa", codigo: "08078" },
      { nombre: "Santo Tomás", codigo: "08685" },
      { nombre: "Palmar de Varela", codigo: "08520" },
      { nombre: "Sabanagrande", codigo: "08634" },
      { nombre: "Luruaco", codigo: "08421" },
      { nombre: "Manatí", codigo: "08436" },
      { nombre: "Candelaria", codigo: "08141" },
      { nombre: "Campo de la Cruz", codigo: "08137" },
      { nombre: "Polonuevo", codigo: "08558" }
    ]
  },
  { nombre: "Bogotá D.C.", codigo: "11", ciudades: [
      { nombre: "Bogotá", codigo: "11001" }
    ]
  },
  { nombre: "Bolívar", codigo: "13", ciudades: [
      { nombre: "Cartagena", codigo: "13001" },
      { nombre: "Magangué", codigo: "13430" },
      { nombre: "Turbaco", codigo: "13836" },
      { nombre: "El Carmen de Bolívar", codigo: "13244" },
      { nombre: "Arjona", codigo: "13052" },
      { nombre: "María la Baja", codigo: "13442" },
      { nombre: "San Juan Nepomuceno", codigo: "13657" },
      { nombre: "Santa Rosa del Sur", codigo: "13688" },
      { nombre: "Mompós", codigo: "13468" },
      { nombre: "San Pablo", codigo: "13670" },
      { nombre: "Achí", codigo: "13006" },
      { nombre: "Pinillos", codigo: "13549" },
      { nombre: "Simití", codigo: "13744" },
      { nombre: "Córdoba", codigo: "13212" },
      { nombre: "San Jacinto", codigo: "13654" }
    ]
  },
  { nombre: "Boyacá", codigo: "15", ciudades: [
      { nombre: "Tunja", codigo: "15001" },
      { nombre: "Duitama", codigo: "15238" },
      { nombre: "Sogamoso", codigo: "15759" },
      { nombre: "Chiquinquirá", codigo: "15176" },
      { nombre: "Paipa", codigo: "15516" },
      { nombre: "Puerto Boyacá", codigo: "15572" },
      { nombre: "Moniquirá", codigo: "15469" },
      { nombre: "Villa de Leyva", codigo: "15407" },
      { nombre: "Garagoa", codigo: "15299" },
      { nombre: "Samacá", codigo: "15646" },
      { nombre: "Nobsa", codigo: "15491" },
      { nombre: "Soatá", codigo: "15753" },
      { nombre: "Tibasosa", codigo: "15806" },
      { nombre: "Ventaquemada", codigo: "15861" },
      { nombre: "Ramiriquí", codigo: "15599" }
    ]
  },
  { nombre: "Caldas", codigo: "17", ciudades: [
      { nombre: "Manizales", codigo: "17001" },
      { nombre: "Chinchiná", codigo: "17174" },
      { nombre: "La Dorada", codigo: "17380" },
      { nombre: "Villamaría", codigo: "17873" },
      { nombre: "Anserma", codigo: "17042" },
      { nombre: "Riosucio", codigo: "17614" },
      { nombre: "Supía", codigo: "17777" },
      { nombre: "Aguadas", codigo: "17013" },
      { nombre: "Manzanares", codigo: "17433" },
      { nombre: "Neira", codigo: "17486" },
      { nombre: "Palestina", codigo: "17524" },
      { nombre: "Pensilvania", codigo: "17541" },
      { nombre: "Salamina", codigo: "17653" },
      { nombre: "Viterbo", codigo: "17877" }
    ]
  },
  { nombre: "Caquetá", codigo: "18", ciudades: [
      { nombre: "Florencia", codigo: "18001" },
      { nombre: "San Vicente del Caguán", codigo: "18753" },
      { nombre: "Puerto Rico", codigo: "18592" },
      { nombre: "El Doncello", codigo: "18247" },
      { nombre: "El Paujil", codigo: "18256" },
      { nombre: "Cartagena del Chairá", codigo: "18150" },
      { nombre: "Curillo", codigo: "18205" },
      { nombre: "Belén de los Andaquíes", codigo: "18094" },
      { nombre: "Albania", codigo: "18029" },
      { nombre: "Morelia", codigo: "18479" },
      { nombre: "Milán", codigo: "18460" },
      { nombre: "Solano", codigo: "18756" },
      { nombre: "Solita", codigo: "18785" },
      { nombre: "Valparaíso", codigo: "18860" },
      { nombre: "San José del Fragua", codigo: "18610" }
    ]
  },
  { nombre: "Casanare", codigo: "85", ciudades: [
      { nombre: "Yopal", codigo: "85001" },
      { nombre: "Aguazul", codigo: "85010" },
      { nombre: "Villanueva", codigo: "85440" },
      { nombre: "Tauramena", codigo: "85410" },
      { nombre: "Paz de Ariporo", codigo: "85250" },
      { nombre: "Monterrey", codigo: "85162" },
      { nombre: "Maní", codigo: "85139" },
      { nombre: "Trinidad", codigo: "85430" },
      { nombre: "Pore", codigo: "85263" },
      { nombre: "Hato Corozal", codigo: "85125" },
      { nombre: "Nunchía", codigo: "85225" },
      { nombre: "Orocué", codigo: "85230" },
      { nombre: "San Luis de Palenque", codigo: "85325" },
      { nombre: "Támara", codigo: "85400" },
      { nombre: "Sabanalarga", codigo: "85300" }
    ]
  },
  { nombre: "Cauca", codigo: "19", ciudades: [
      { nombre: "Popayán", codigo: "19001" },
      { nombre: "Santander de Quilichao", codigo: "19698" },
      { nombre: "Puerto Tejada", codigo: "19573" },
      { nombre: "Patía", codigo: "19532" },
      { nombre: "Miranda", codigo: "19455" },
      { nombre: "Caloto", codigo: "19142" },
      { nombre: "Piendamó", codigo: "19548" },
      { nombre: "Guapi", codigo: "19318" },
      { nombre: "Timbío", codigo: "19807" },
      { nombre: "Cajibío", codigo: "19130" },
      { nombre: "Corinto", codigo: "19212" },
      { nombre: "Suárez", codigo: "19780" },
      { nombre: "Buenos Aires", codigo: "19110" },
      { nombre: "Bolívar", codigo: "19100" },
      { nombre: "Inzá", codigo: "19355" }
    ]
  },
  { nombre: "Cesar", codigo: "20", ciudades: [
      { nombre: "Valledupar", codigo: "20001" },
      { nombre: "Aguachica", codigo: "20011" },
      { nombre: "Bosconia", codigo: "20060" },
      { nombre: "Agustín Codazzi", codigo: "20013" },
      { nombre: "La Jagua de Ibirico", codigo: "20400" },
      { nombre: "El Copey", codigo: "20238" },
      { nombre: "Chiriguaná", codigo: "20178" },
      { nombre: "Curumaní", codigo: "20228" },
      { nombre: "San Alberto", codigo: "20710" },
      { nombre: "Pelaya", codigo: "20550" },
      { nombre: "Astrea", codigo: "20032" },
      { nombre: "Becerril", codigo: "20045" },
      { nombre: "Chimichagua", codigo: "20175" },
      { nombre: "La Paz", codigo: "20621" },
      { nombre: "Manaure Balcón del Cesar", codigo: "20443" }
    ]
  },
  { nombre: "Chocó", codigo: "27", ciudades: [
      { nombre: "Quibdó", codigo: "27001" },
      { nombre: "Istmina", codigo: "27361" },
      { nombre: "Bahía Solano", codigo: "27075" },
      { nombre: "Tadó", codigo: "27787" },
      { nombre: "Acandí", codigo: "27006" },
      { nombre: "Condoto", codigo: "27205" },
      { nombre: "Riosucio", codigo: "27615" },
      { nombre: "Nuquí", codigo: "27495" },
      { nombre: "Unguía", codigo: "27800" },
      { nombre: "Medio Atrato", codigo: "27425" },
      { nombre: "Bojayá", codigo: "27099" },
      { nombre: "El Carmen de Atrato", codigo: "27245" },
      { nombre: "Lloró", codigo: "27413" },
      { nombre: "Medio San Juan", codigo: "27450" },
      { nombre: "Juradó", codigo: "27372" }
    ]
  },
  { nombre: "Córdoba", codigo: "23", ciudades: [
      { nombre: "Montería", codigo: "23001" },
      { nombre: "Cereté", codigo: "23162" },
      { nombre: "Lorica", codigo: "23417" },
      { nombre: "Montelíbano", codigo: "23466" },
      { nombre: "Sahagún", codigo: "23660" },
      { nombre: "Planeta Rica", codigo: "23555" },
      { nombre: "Tierralta", codigo: "23807" },
      { nombre: "Puerto Libertador", codigo: "23580" },
      { nombre: "Ciénaga de Oro", codigo: "23189" },
      { nombre: "Chinú", codigo: "23182" },
      { nombre: "San Andrés de Sotavento", codigo: "23670" },
      { nombre: "Ayapel", codigo: "23068" },
      { nombre: "Valencia", codigo: "23855" },
      { nombre: "San Antero", codigo: "23672" },
      { nombre: "San Bernardo del Viento", codigo: "23675" }
    ]
  },
  { nombre: "Cundinamarca", codigo: "25", ciudades: [
      { nombre: "Zipaquirá", codigo: "25899" },
      { nombre: "Facatativá", codigo: "25269" },
      { nombre: "Chía", codigo: "25175" },
      { nombre: "Mosquera", codigo: "25473" },
      { nombre: "Soacha", codigo: "25754" },
      { nombre: "Fusagasugá", codigo: "25290" },
      { nombre: "Madrid", codigo: "25430" },
      { nombre: "Funza", codigo: "25286" },
      { nombre: "Cajicá", codigo: "25126" },
      { nombre: "Girardot", codigo: "25307" },
      { nombre: "Cota", codigo: "25214" },
      { nombre: "La Calera", codigo: "25377" },
      { nombre: "Tocancipá", codigo: "25817" },
      { nombre: "Sopó", codigo: "25758" },
      { nombre: "Tenjo", codigo: "25799" },
      { nombre: "Ubaté", codigo: "25843" },
      { nombre: "Sibaté", codigo: "25740" },
      { nombre: "Guaduas", codigo: "25320" },
      { nombre: "Villeta", codigo: "25875" },
      { nombre: "Pacho", codigo: "25513" }
    ]
  },
  { nombre: "Guainía", codigo: "94", ciudades: [
      { nombre: "Inírida", codigo: "94001" },
      { nombre: "Barranco Minas", codigo: "94343" },
      { nombre: "Mapiripana", codigo: "94663" },
      { nombre: "San Felipe", codigo: "94883" },
      { nombre: "Puerto Colombia", codigo: "94884" },
      { nombre: "La Guadalupe", codigo: "94885" },
      { nombre: "Cacahual", codigo: "94886" },
      { nombre: "Pana Pana", codigo: "94887" },
      { nombre: "Morichal", codigo: "94888" }
    ]
  },
  { nombre: "Guaviare", codigo: "95", ciudades: [
      { nombre: "San José del Guaviare", codigo: "95001" },
      { nombre: "Calamar", codigo: "95015" },
      { nombre: "El Retorno", codigo: "95025" },
      { nombre: "Miraflores", codigo: "95200" }
    ]
  },
  { nombre: "Huila", codigo: "41", ciudades: [
      { nombre: "Neiva", codigo: "41001" },
      { nombre: "Pitalito", codigo: "41551" },
      { nombre: "Garzón", codigo: "41298" },
      { nombre: "La Plata", codigo: "41396" },
      { nombre: "Campoalegre", codigo: "41132" },
      { nombre: "Palermo", codigo: "41524" },
      { nombre: "Gigante", codigo: "41306" },
      { nombre: "Aipe", codigo: "41016" },
      { nombre: "Rivera", codigo: "41615" },
      { nombre: "Algeciras", codigo: "41020" },
      { nombre: "Hobo", codigo: "41349" },
      { nombre: "Isnos", codigo: "41359" },
      { nombre: "San Agustín", codigo: "41668" },
      { nombre: "Timaná", codigo: "41807" },
      { nombre: "Acevedo", codigo: "41006" }
    ]
  },
  { nombre: "La Guajira", codigo: "44", ciudades: [
      { nombre: "Riohacha", codigo: "44001" },
      { nombre: "Maicao", codigo: "44430" },
      { nombre: "Uribia", codigo: "44847" },
      { nombre: "Manaure", codigo: "44560" },
      { nombre: "Dibulla", codigo: "44090" },
      { nombre: "Fonseca", codigo: "44279" },
      { nombre: "San Juan del Cesar", codigo: "44650" },
      { nombre: "Barrancas", codigo: "44078" },
      { nombre: "Villanueva", codigo: "44874" },
      { nombre: "Albania", codigo: "44035" },
      { nombre: "Hatonuevo", codigo: "44378" },
      { nombre: "Distracción", codigo: "44098" },
      { nombre: "El Molino", codigo: "44110" },
      { nombre: "Urumita", codigo: "44855" },
      { nombre: "La Jagua del Pilar", codigo: "44420" }
    ]
  },
  { nombre: "Magdalena", codigo: "47", ciudades: [
      { nombre: "Santa Marta", codigo: "47001" },
      { nombre: "Ciénaga", codigo: "47189" },
      { nombre: "Fundación", codigo: "47288" },
      { nombre: "El Banco", codigo: "47245" },
      { nombre: "Aracataca", codigo: "47053" },
      { nombre: "Plato", codigo: "47555" },
      { nombre: "Zona Bananera", codigo: "47980" },
      { nombre: "Pivijay", codigo: "47551" },
      { nombre: "Ariguaní", codigo: "47058" },
      { nombre: "Sitio Nuevo", codigo: "47745" },
      { nombre: "Pueblo Viejo", codigo: "47570" },
      { nombre: "Salamina", codigo: "47675" },
      { nombre: "El Retén", codigo: "47268" },
      { nombre: "Guamal", codigo: "47318" },
      { nombre: "San Sebastián de Buenavista", codigo: "47692" }
    ]
  },
  { nombre: "Meta", codigo: "50", ciudades: [
      { nombre: "Villavicencio", codigo: "50001" },
      { nombre: "Acacías", codigo: "50006" },
      { nombre: "Granada", codigo: "50313" },
      { nombre: "Puerto López", codigo: "50573" },
      { nombre: "La Macarena", codigo: "50350" },
      { nombre: "San Martín", codigo: "50689" },
      { nombre: "Puerto Gaitán", codigo: "50568" },
      { nombre: "Vistahermosa", codigo: "50711" },
      { nombre: "Cumaral", codigo: "50226" },
      { nombre: "Castilla la Nueva", codigo: "50150" },
      { nombre: "Guamal", codigo: "50318" },
      { nombre: "Restrepo", codigo: "50606" },
      { nombre: "Puerto Rico", codigo: "50590" },
      { nombre: "Mesetas", codigo: "50330" },
      { nombre: "Lejanías", codigo: "50400" }
    ]
  },
  { nombre: "Nariño", codigo: "52", ciudades: [
      { nombre: "Pasto", codigo: "52001" },
      { nombre: "Ipiales", codigo: "52356" },
      { nombre: "Tumaco", codigo: "52835" },
      { nombre: "Túquerres", codigo: "52838" },
      { nombre: "La Unión", codigo: "52399" },
      { nombre: "Samaniego", codigo: "52678" },
      { nombre: "Sandoná", codigo: "52683" },
      { nombre: "Buesaco", codigo: "52110" },
      { nombre: "Cumbal", codigo: "52227" },
      { nombre: "Barbacoas", codigo: "52079" },
      { nombre: "Pupiales", codigo: "52585" },
      { nombre: "Ricaurte", codigo: "52612" },
      { nombre: "Guachucal", codigo: "52317" },
      { nombre: "Linares", codigo: "52411" },
      { nombre: "El Charco", codigo: "52250" }
    ]
  },
  { nombre: "Norte de Santander", codigo: "54", ciudades: [
      { nombre: "Cúcuta", codigo: "54001" },
      { nombre: "Ocaña", codigo: "54498" },
      { nombre: "Pamplona", codigo: "54518" },
      { nombre: "Villa del Rosario", codigo: "54874" },
      { nombre: "Los Patios", codigo: "54405" },
      { nombre: "Tibú", codigo: "54810" },
      { nombre: "Abrego", codigo: "54003" },
      { nombre: "El Zulia", codigo: "54261" },
      { nombre: "Sardinata", codigo: "54720" },
      { nombre: "Chinácota", codigo: "54172" },
      { nombre: "Convención", codigo: "54206" },
      { nombre: "Puerto Santander", codigo: "54553" },
      { nombre: "Toledo", codigo: "54820" },
      { nombre: "Teorama", codigo: "54800" },
      { nombre: "Hacarí", codigo: "54344" }
    ]
  },
  { nombre: "Putumayo", codigo: "86", ciudades: [
      { nombre: "Mocoa", codigo: "86001" },
      { nombre: "Puerto Asís", codigo: "86568" },
      { nombre: "Orito", codigo: "86320" },
      { nombre: "Valle del Guamuez", codigo: "86865" },
      { nombre: "Villagarzón", codigo: "86885" },
      { nombre: "Puerto Guzmán", codigo: "86571" },
      { nombre: "San Miguel", codigo: "86757" },
      { nombre: "Puerto Caicedo", codigo: "86569" },
      { nombre: "Sibundoy", codigo: "86749" },
      { nombre: "Colón", codigo: "86219" },
      { nombre: "Santiago", codigo: "86760" },
      { nombre: "San Francisco", codigo: "86755" },
      { nombre: "Puerto Leguízamo", codigo: "86573" }
    ]
  },
  { nombre: "Quindío", codigo: "63", ciudades: [
      { nombre: "Armenia", codigo: "63001" },
      { nombre: "Calarcá", codigo: "63130" },
      { nombre: "Montenegro", codigo: "63470" },
      { nombre: "Quimbaya", codigo: "63594" },
      { nombre: "La Tebaida", codigo: "63401" },
      { nombre: "Circasia", codigo: "63190" },
      { nombre: "Filandia", codigo: "63272" },
      { nombre: "Salento", codigo: "63690" },
      { nombre: "Génova", codigo: "63302" },
      { nombre: "Córdoba", codigo: "63212" },
      { nombre: "Pijao", codigo: "63548" },
      { nombre: "Buenavista", codigo: "63111" }
    ]
  },
  { nombre: "Risaralda", codigo: "66", ciudades: [
      { nombre: "Pereira", codigo: "66001" },
      { nombre: "Dosquebradas", codigo: "66170" },
      { nombre: "Santa Rosa de Cabal", codigo: "66682" },
      { nombre: "La Virginia", codigo: "66400" },
      { nombre: "Belén de Umbría", codigo: "66088" },
      { nombre: "Quinchía", codigo: "66594" },
      { nombre: "Santuario", codigo: "66687" },
      { nombre: "Marsella", codigo: "66440" },
      { nombre: "Apía", codigo: "66045" },
      { nombre: "Guática", codigo: "66318" },
      { nombre: "Mistrató", codigo: "66456" },
      { nombre: "Balboa", codigo: "66075" },
      { nombre: "La Celia", codigo: "66383" },
      { nombre: "Pueblo Rico", codigo: "66572" }
    ]
  },
  { nombre: "San Andrés y Providencia", codigo: "88", ciudades: [
      { nombre: "San Andrés", codigo: "88001" },
      { nombre: "Providencia", codigo: "88564" }
    ]
  },
  { nombre: "Santander", codigo: "68", ciudades: [
      { nombre: "Bucaramanga", codigo: "68001" },
      { nombre: "Floridablanca", codigo: "68276" },
      { nombre: "Girón", codigo: "68307" },
      { nombre: "Piedecuesta", codigo: "68547" },
      { nombre: "Barrancabermeja", codigo: "68081" },
      { nombre: "San Gil", codigo: "68679" },
      { nombre: "Socorro", codigo: "68755" },
      { nombre: "Barbosa", codigo: "68077" },
      { nombre: "Málaga", codigo: "68432" },
      { nombre: "Vélez", codigo: "68861" },
      { nombre: "Cimitarra", codigo: "68190" },
      { nombre: "Lebrija", codigo: "68406" },
      { nombre: "Sabana de Torres", codigo: "68655" },
      { nombre: "Puerto Wilches", codigo: "68575" },
      { nombre: "Charalá", codigo: "68167" }
    ]
  },
  { nombre: "Sucre", codigo: "70", ciudades: [
      { nombre: "Sincelejo", codigo: "70001" },
      { nombre: "Corozal", codigo: "70215" },
      { nombre: "San Marcos", codigo: "70708" },
      { nombre: "San Onofre", codigo: "70713" },
      { nombre: "Tolú", codigo: "70820" },
      { nombre: "Sampués", codigo: "70670" },
      { nombre: "San Luis de Sincé", codigo: "70742" },
      { nombre: "San Benito Abad", codigo: "70678" },
      { nombre: "Majagual", codigo: "70429" },
      { nombre: "Coveñas", codigo: "70221" },
      { nombre: "Galeras", codigo: "70235" },
      { nombre: "Tolú Viejo", codigo: "70823" },
      { nombre: "Morroa", codigo: "70473" },
      { nombre: "Ovejas", codigo: "70508" },
      { nombre: "Los Palmitos", codigo: "70418" }
    ]
  },
  { nombre: "Tolima", codigo: "73", ciudades: [
      { nombre: "Ibagué", codigo: "73001" },
      { nombre: "Espinal", codigo: "73268" },
      { nombre: "Melgar", codigo: "73449" },
      { nombre: "Chaparral", codigo: "73168" },
      { nombre: "Líbano", codigo: "73411" },
      { nombre: "Mariquita", codigo: "73443" },
      { nombre: "Honda", codigo: "73349" },
      { nombre: "Flandes", codigo: "73275" },
      { nombre: "Fresno", codigo: "73283" },
      { nombre: "Purificación", codigo: "73585" },
      { nombre: "Guamo", codigo: "73319" },
      { nombre: "Cajamarca", codigo: "73124" },
      { nombre: "Rovira", codigo: "73624" },
      { nombre: "Ortega", codigo: "73504" },
      { nombre: "Planadas", codigo: "73555" }
    ]
  },
  { nombre: "Valle del Cauca", codigo: "76", ciudades: [
      { nombre: "Cali", codigo: "76001" },
      { nombre: "Buenaventura", codigo: "76109" },
      { nombre: "Palmira", codigo: "76520" },
      { nombre: "Tuluá", codigo: "76834" },
      { nombre: "Buga", codigo: "76111" },
      { nombre: "Cartago", codigo: "76147" },
      { nombre: "Jamundí", codigo: "76364" },
      { nombre: "Yumbo", codigo: "76892" },
      { nombre: "Candelaria", codigo: "76130" },
      { nombre: "Florida", codigo: "76275" },
      { nombre: "Pradera", codigo: "76563" },
      { nombre: "Zarzal", codigo: "76895" },
      { nombre: "Sevilla", codigo: "76736" },
      { nombre: "Caicedonia", codigo: "76122" },
      { nombre: "Roldanillo", codigo: "76622" }
    ]
  },
  { nombre: "Vaupés", codigo: "97", ciudades: [
      { nombre: "Mitú", codigo: "97001" },
      { nombre: "Carurú", codigo: "97161" },
      { nombre: "Taraira", codigo: "97666" },
      { nombre: "Papunaua", codigo: "97777" },
      { nombre: "Yavaraté", codigo: "97889" }
    ]
  },
  { nombre: "Vichada", codigo: "99", ciudades: [
      { nombre: "Puerto Carreño", codigo: "99001" },
      { nombre: "La Primavera", codigo: "99524" },
      { nombre: "Santa Rosalía", codigo: "99624" },
      { nombre: "Cumaribo", codigo: "99773" }
    ]
  }
];
