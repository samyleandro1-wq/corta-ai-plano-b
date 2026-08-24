<button onClick={()=>{
  const videoId = c.link.split('v=')[1]?.split('&')[0] || c.link.split('/').pop().split('?')[0];
  // esse site sempre funciona e já baixa direto
  window.open(`https://www.yout.com/watch?v=${videoId}`, '_blank');
}} className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold">BAIXAR MP4</button>
