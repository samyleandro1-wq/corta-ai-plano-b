Skip to content
samyleandro1-wq
corta-ai-plano-b
Repository navigation
Code
Issues
Pull requests
Actions
Projects
Wiki
Security and quality
Insights
Settings
Files
Go to file
t
T
app
api
baixar
route.j
pagamento
globals.css
layout.js
page.js
package.json
postcss.config.js
tailwind.config.js
corta-ai-plano-b/app/api/baixar
/
route.j
in
main

Edit

Preview
Indent mode

Spaces
Indent size

2
Line wrap mode

No wrap
Editing route.j file contents
  1
  2
  3
  4
  5
  6
<button onClick={()=>{
  const videoId = c.link.split('v=')[1]?.split('&')[0] || c.link.split('/').pop().split('?')[0];
  // esse site sempre funciona e já baixa direto
  window.open(`https://www.yout.com/watch?v=${videoId}`, '_blank');
}} className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold">BAIXAR MP4</button>

Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
 
