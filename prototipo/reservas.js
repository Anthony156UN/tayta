const KEY = 'tayta.reservas.demo.v1';
const TEN = 600000;
const sessions = [
  {id:'ceramica',title:'Cerámica con historia',teacher:'Elena Quispe',mode:'Virtual',when:'Sábado · 16:00 · hora de Perú',price:45,img:'pottery.webp'},
  {id:'tejido',title:'Tejido andino en telar de cintura',teacher:'Rosa Quispe',mode:'Presencial',when:'Domingo · 10:00 · hora de Perú',price:45,img:'tayta-hero.webp'}
];
const session = id => sessions.find(x=>x.id===id);
const active = (r,now) => r.state==='Confirmada';
const free = (db,id,now) => 3-db.rows.filter(r=>r.sid===id && active(r,now)).length;
function transition(db,id,action,now,data={}) {
  const r=db.rows.find(row=>row.id===id);
  if(!r) throw Error('La solicitud ya no está disponible.');
  if(action==='hold'){
    if(['Confirmada','En revisión'].includes(r.state) || free(db,r.sid,now)<1) throw Error('No hay un turno disponible para esta solicitud.');
    r.state='En pago';r.until=now+TEN;
  }else if(action==='submit'){
    if(!['En pago','Corregir'].includes(r.state)||r.until<=now) throw Error('Tu turno venció. Solicita otro antes de enviar.');
    const op=data.op.trim().toUpperCase();
    if(!op) throw Error('Escribe el número de operación.');
    if(db.rows.some(other=>other.id!==id && ['En revisión','Confirmada'].includes(other.state) && other.method===data.method && other.op===op)) throw Error('Esta operación ya se presentó.');
    Object.assign(r,{op,method:data.method,proof:data.proof,state:'En revisión',note:''});
  }else if(action==='approve'||action==='correct'){
    if(r.state!=='En revisión') throw Error('Este comprobante ya fue revisado.');
    if(action==='correct' && !data.note?.trim()) throw Error('Indica qué debe corregirse.');
    if(action==='approve' && free(db,r.sid,now)<1) throw Error('Horario completo. Coordina una devolución o un cambio con el estudiante antes de cerrar su caso.');
    r.state=action==='approve'?'Confirmada':'Corregir';r.note=data.note||'';r.until=now+TEN;
  }
}

const $ = selector => document.querySelector(selector);
const role = $('#role'), view = $('#view');
let selected = sessions[0].id;
function read(){return JSON.parse(localStorage.getItem(KEY)||'{"rows":[],"access":{}}')}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function announcement(message){$('#status').textContent=message}
async function update(change,message){
  function commit(){const db=read();change(db);localStorage.setItem(KEY,JSON.stringify(db))}
  try{if(navigator.locks)await navigator.locks.request(KEY,commit);else commit();render();announcement(message)}
  catch(e){announcement(e.message)}
}
function seatLabel(db,id){const rows=db.rows.filter(r=>r.sid===id), confirmed=rows.filter(r=>r.state==='Confirmada').length, available=free(db,id,Date.now());return available+' libres · '+rows.filter(r=>r.state==='En revisión').length+' pagos en revisión · '+confirmed+' confirmados'}
function chooser(){return '<label>Clase y horario<select id="session">'+sessions.map(s=>'<option value="'+s.id+'" '+(selected===s.id?'selected':'')+'>'+s.title+' · '+s.when+'</option>').join('')+'</select></label>'}
function headerCard(s,db){return '<section class="sheet hero"><picture><source media="(max-width: 640px)" srcset="../assets/hero.webp"><img src="../assets/'+s.img+'" alt="Taller de TAYTA"></picture><div><span class="pill">'+s.mode+'</span><h2>'+s.title+'</h2><p>Con '+s.teacher+'</p><p>'+s.when+' · S/ '+s.price+'</p><p class="count" id="seats">'+seatLabel(db,s.id)+'</p></div></section>'}
function displayState(r){return ['Corregir','En pago'].includes(r.state)&&r.until<=Date.now()?'Turno vencido':r.state}
function accessText(db,s){const value=db.access[s.id];if(!value)return '<p>La información de acceso está pendiente del profesor.</p>';return s.mode==='Virtual'?'<a class="action" target="_blank" rel="noopener noreferrer" href="'+esc(value)+'">Entrar a Google Meet</a>':'<p>Dirección: '+esc(value)+'</p>'}
function payment(r,s){return '<p>Formulario válido hasta las '+new Date(r.until).toLocaleTimeString('es-PE')+' (hora de tu dispositivo).</p><p><b>S/ '+s.price+' · Titular de ejemplo: TAYTA Demo</b></p><p>Yape: 9XX XXX XXX · Transferencia: cuenta de muestra. Practica con una operación ficticia. Tu cupo se asignará al aprobar el pago.</p><form data-kind="proof" data-id="'+r.id+'"><label>Medio de pago<select name="method"><option>Yape</option><option>Transferencia</option></select></label><label>Número de operación<input name="op" required maxlength="32"></label><label>Captura de ejemplo (opcional)<input name="file" type="file" accept="image/jpeg,image/png,image/webp"></label><small>En una captura deben verse el monto, la fecha y la hora. Puedes continuar con el comprobante de muestra.</small><button>Enviar comprobante</button></form>'}
function studentRow(r,db){
  const s=session(r.sid),state=displayState(r);
  let body='';
  if(state==='Pendiente de pago'||state==='Turno vencido')body='<button data-action="hold" data-id="'+r.id+'">Pagar ahora</button>';
  if(['En pago','Corregir'].includes(state))body=(r.note?'<p>Corrección: '+esc(r.note)+'</p>':'')+payment(r,s);
  if(state==='En revisión')body='<p>Administración revisará tu operación. El cupo se asigna al confirmar el pago.</p>';
  if(state==='Confirmada')body=accessText(db,s)+'<details><summary>Ver correo simulado</summary><p>Para: '+esc(r.email)+'</p><p>Hola, '+esc(r.name)+'. Confirmamos tu pago de S/ '+s.price+' por '+s.title+'. '+s.when+'. Consulta el acceso en Mis reservas.</p></details>';
  return '<article><span class="pill">'+state+'</span><h3>'+s.title+'</h3><p>'+esc(r.name)+' · '+r.id+'</p>'+body+'</article>'
}
function admin(db,s){
 const rows=db.rows.filter(r=>r.sid===s.id&&r.state==='En revisión');
 return '<h2>Pagos por revisar ('+rows.length+')</h2>'+(!rows.length?'<p>Aquí aparecerán los comprobantes enviados para este horario.</p>':'')+rows.map(r=>'<article><h3>'+esc(r.name)+'</h3><p>'+r.id+' · '+esc(r.email)+'</p><p>'+esc(r.method)+' · S/ '+s.price+' · Operación '+esc(r.op)+'</p>'+(r.proof?'<img class="proof" src="'+esc(r.proof)+'" alt="Captura adjunta">':'<p>Comprobante de muestra</p>')+'<p>En esta simulación puedes aprobar el ingreso o solicitar una corrección.</p><button data-action="approve" data-id="'+r.id+'">Confirmar pago</button><details><summary>Solicitar corrección</summary><form data-kind="correct" data-id="'+r.id+'"><label>Qué debe corregirse<input name="note" maxlength="160" required></label><button>Enviar indicación</button></form></details></article>').join('')
}
function roster(db,s){const rows=db.rows.filter(r=>r.sid===s.id&&r.state==='Confirmada');return '<section class="sheet"><h2>Estudiantes confirmados ('+rows.length+')</h2>'+ (rows.length?rows.map(r=>'<p>'+esc(r.name)+' · '+esc(r.email)+'</p>').join(''):'<p>Aún no hay pagos aprobados para este horario.</p>')+'</section>'}
function render(){const db=read(),s=session(selected);previous=db.rows.map(displayState).join('|');let body='';
 if(role.value==='Estudiante')body='<section class="sheet"><h2>Solicitar reserva</h2><form data-kind="book"><label>Nombre de ejemplo<input name="name" maxlength="70" required placeholder="Anthony"></label><label>Correo de ejemplo<input type="email" name="email" required placeholder="anthony@example.com"></label><button>Reservar</button></form></section><h2>Mis reservas de prueba</h2>'+ (db.rows.length?db.rows.slice().reverse().map(r=>studentRow(r,db)).join(''):'<p>Todavía no has solicitado una clase.</p>');
 else if(role.value==='Administrador')body=admin(db,s)+roster(db,s);
 else body='<section class="sheet"><h2>Acceso al encuentro</h2><form data-kind="access"><label>'+(s.mode==='Virtual'?'Enlace de Google Meet':'Dirección e indicaciones')+'<input name="access" required maxlength="250" value="'+esc(db.access[s.id]||'')+'"></label><button>Guardar para este horario</button></form></section>'+roster(db,s);
 view.innerHTML=chooser()+headerCard(s,db)+body;
}
role.onchange=()=>{announcement('');render()};
view.onchange=e=>{if(e.target.id==='session'){selected=e.target.value;announcement('');render()}};
view.onclick=e=>{const b=e.target.closest('[data-action]');if(b)update(db=>transition(db,b.dataset.id,b.dataset.action,Date.now()),b.dataset.action==='approve'?'Pago confirmado. El estudiante ya puede consultar su reserva.':'Turno de pago abierto.')};
function readPhoto(file){if(!file?.size)return Promise.resolve('');if(file.size>600000||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Usa una imagen JPG, PNG o WebP menor de 600 KB.');return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('No se pudo leer la foto.'));reader.readAsDataURL(file)})}
view.onsubmit=async e=>{
 e.preventDefault();const form=e.target, data=new FormData(form), id=form.dataset.id,s=session(selected);
 try{
 if(form.dataset.kind==='book'){const name=data.get('name').trim(),email=data.get('email').trim().toLowerCase();if(!name)throw Error('Escribe un nombre.');
 await update(db=>{if(free(db,s.id,Date.now())<1)throw Error('Este horario está completo. Elige otro horario.');if(db.rows.some(r=>r.sid===s.id&&r.email===email))throw Error('Este correo ya tiene una solicitud para ese horario. Consulta Mis reservas.');db.rows.push({id:'TAY-'+crypto.randomUUID().slice(0,8),sid:s.id,name,email,state:'Pendiente de pago'})},'Solicitud guardada. Los cupos siguen libres.')}
 if(form.dataset.kind==='proof'){const proof=await readPhoto(data.get('file'));await update(db=>transition(db,id,'submit',Date.now(),{op:data.get('op'),method:data.get('method'),proof}),'Comprobante enviado a revisión.')}
 if(form.dataset.kind==='correct')await update(db=>transition(db,id,'correct',Date.now(),{note:data.get('note').trim()}),'Corrección solicitada. El estudiante tiene diez minutos para responder.');
 if(form.dataset.kind==='access'){const value=data.get('access').trim();if(!value||(s.mode==='Virtual'&&!/^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}\/?$/i.test(value)))throw Error('Introduce una dirección o un enlace válido de Google Meet para esta sesión.');await update(db=>db.access[s.id]=value,'Acceso guardado para los estudiantes confirmados.')}
 }catch(err){announcement(err.message)}
};
window.addEventListener('storage',e=>{if(e.key===KEY)render()});
let previous='';setInterval(()=>{const db=read(),snapshot=db.rows.map(displayState).join('|');if(previous&&previous!==snapshot)render();previous=snapshot},1000);
render();
