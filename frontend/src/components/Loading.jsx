import React from 'react';

export default function Loading() {
  return (
    <div style={{
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      height:'60vh', gap:16
    }}>
      <div style={{
        width:48, height:48, border:'4px solid #f0f0f0',
        borderTop:'4px solid #4ade80', borderRadius:'50%',
        animation:'spin 0.8s linear infinite'
      }}/>
      <p style={{color:'#888', fontSize:14}}>Carregando dados do Rodoanel...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}