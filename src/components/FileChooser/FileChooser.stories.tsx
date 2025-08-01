import React, { useState } from 'react';
import { FileChooser } from './FileChooser';

export const Default = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <FileChooser
        title="Seleccionar Archivo"
        description="Cargue un archivo desde su equipo o desde un enlace de Google Sheets"
        setFile={setFile}
        allowedExtensions={{ '.xlsx': true, '.xls': true }}
      />
      {file && <p>Archivo seleccionado: {file.name}</p>}
    </div>
  );
};

export const WithoutLink = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <FileChooser
        title="Solo local"
        description="Solo se permite seleccionar un archivo local"
        setFile={setFile}
        showLinkInput={false}
        allowedExtensions={{ '.pdf': true }}
      />
      {file && <p>Archivo seleccionado: {file.name}</p>}
    </div>
  );
};
