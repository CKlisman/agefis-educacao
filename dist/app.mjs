import {types,statuses,select,countBy,total,ranking,percent} from './model.mjs';
const $=id=>document.getElementById(id);
const colors=['#e7781c','#087442','#6d7e77','#ae821b'];
const statusColors=['#087442','#8b9690','#df8a2a'];
let data,filtered=[],expanded={coll:false,dep:false};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const activeFilters=()=>Object.fromEntries(['vinculo','study','dep'].map(k=>[k,$(k).value]));
const bar=(label,n,max,color,index)=>`<div class="bar-row"><div class="row-label"><span class="rank-label">${index!==undefined?`<span class="rank-position">${index+1}</span>`:''}${esc(label)}</span><span class="row-value">${n}</span></div><div class="track" aria-hidden="true"><div class="fill" style="width:${max?100*n/max:0}%;background:${color}"></div></div></div>`;
function studyChart(id,key){
  const n=total(filtered),counts=countBy(filtered,key,statuses),yes=counts[0].n;
  $(id).innerHTML=`<div class="study-top"><span class="percent-main">${percent(yes,n)}</span><span class="study-description"><strong>${yes} de ${n} colaboradores</strong>${key==='study'?'declararam estudar':'responderam “Sim”'}</span></div><div class="stack" aria-hidden="true">${counts.map((r,i)=>`<span style="width:${n?100*r.n/n:0}%;background:${statusColors[i]}"></span>`).join('')}</div><div class="legend">${counts.map((r,i)=>`<div class="legend-row"><span class="legend-dot" style="background:${statusColors[i]}" aria-hidden="true"></span><span>${r.label}</span><span class="legend-n">${r.n}</span><span class="legend-pct">${percent(r.n,n)}</span></div>`).join('')}</div>`;
}
function renderRank(target){
  const yes=$('scope').value==='yes',field=target==='coll'?'study':'dep';
  const pool=filtered.filter(g=>!yes||g[field]==='Sim'),n=total(pool);
  const rows=ranking(filtered,target,yes),view=expanded[target]?rows:rows.slice(0,6);
  $(target+'-badge').textContent=`${rows.length} ${rows.length===1?'instituição':'instituições'}`;
  $(target+'-rank').innerHTML=rows.length?view.map((r,i)=>bar(r.label,r.n,rows[0].n,target==='coll'?'#e7781c':'#087442',i)).join(''):`<div class="empty"><strong>Sem instituições neste recorte</strong>Altere os filtros ou considere todas as menções de interesse.</div>`;
  const more=$(target+'-more');more.hidden=rows.length<=6;more.textContent=expanded[target]?'Mostrar principais instituições':`Ver todas as ${rows.length} instituições`;more.setAttribute('aria-expanded',String(expanded[target]));
  const blank=pool.reduce((s,g)=>s+g[target==='coll'?'collBlank':'depBlank'],0),unidentified=pool.reduce((s,g)=>s+g[target==='coll'?'collUnidentified':'depUnidentified'],0);
  $(target+'-quality').textContent=`Base: ${n} ${n===1?'colaborador':'colaboradores'}${yes?(n===1?' que respondeu “Sim”':' que responderam “Sim”'):''}. ${blank} sem preenchimento de instituição; ${unidentified} sem instituição identificável. Campos podem citar instituição atual ou desejada.`;
}
function tableRow(label,groups,color){
  const count=(key,status)=>total(groups.filter(g=>g[key]===status));
  return `<tr><td>${color?`<span class="legend-dot" style="background:${color}" aria-hidden="true"></span>`:''}${label}</td><td>${total(groups)}</td><td>${count('study','Sim')}</td><td>${count('study','Não')}</td><td>${count('dep','Sim')}</td><td>${count('dep','Não')}</td><td>${count('dep','Não informado')}</td></tr>`;
}
function render(){
  filtered=select(data.groups,activeFilters());const n=total(filtered),vinculos=countBy(filtered,'vinculo',types),isFiltered=Object.values(activeFilters()).some(Boolean);
  $('base').textContent=`${n} de ${data.meta.people} colaboradores únicos${isFiltered?' no recorte':' na base consolidada'}`;
  $('kpis').innerHTML=`<article class="kpi total"><div class="kpi-label">Colaboradores</div><div class="kpi-number">${n}</div><div class="kpi-desc">${isFiltered?'No recorte selecionado':'Envios únicos consolidados'}</div></article>`+vinculos.map((r,i)=>`<article class="kpi"><div class="kpi-label"><span class="kpi-dot" style="background:${colors[i]}" aria-hidden="true"></span>${r.label==='Efetivo'?'Efetivos':r.label==='Comissionado'?'Comissionados':r.label==='Terceirizado'?'Terceirizados':'Estagiários'}</div><div class="kpi-number">${r.n}</div><div class="kpi-desc">${percent(r.n,n)} do recorte</div></article>`).join('');
  $('vinculo-chart').innerHTML=vinculos.map((r,i)=>`<div class="bar-row"><div class="row-label"><span>${r.label}</span><span class="row-value">${r.n}<small>${percent(r.n,n)}</small></span></div><div class="track" aria-hidden="true"><div class="fill" style="width:${n?100*r.n/n:0}%;background:${colors[i]}"></div></div></div>`).join('');
  studyChart('study-chart','study');studyChart('dep-chart','dep');renderRank('coll');renderRank('dep');
  $('breakdown').innerHTML=types.map((t,i)=>tableRow(t,filtered.filter(g=>g.vinculo===t),colors[i])).join('')+tableRow('Total',filtered);
}
function exportCsv(){
  const f=activeFilters(),yes=$('scope').value==='yes';
  const csvRows=[['AGEFIS + Educação — Painel executivo'],['Desenvolvido por','Caio Klisman'],['Base','22/10/2026'],['Filtros',`Vínculo: ${f.vinculo||'Todos'} | Colaborador estuda: ${f.study||'Todos'} | Dependente estuda: ${f.dep||'Todos'}`],['Colaboradores únicos no recorte',total(filtered)],[],['Vínculo','Colaboradores','Estudam','Não estudam','Dependente estuda','Dependente não estuda','Dependente: não informado']];
  for(const label of [...types,'Total']){const pool=label==='Total'?filtered:filtered.filter(g=>g.vinculo===label);csvRows.push([label,total(pool),total(pool.filter(g=>g.study==='Sim')),total(pool.filter(g=>g.study==='Não')),total(pool.filter(g=>g.dep==='Sim')),total(pool.filter(g=>g.dep==='Não')),total(pool.filter(g=>g.dep==='Não informado'))]);}
  csvRows.push([],['Instituições atuais ou desejadas — '+(yes?'apenas respostas Sim':'todas as menções')],['Grupo','Instituição','Colaboradores que citaram']);
  for(const target of ['coll','dep'])for(const r of ranking(filtered,target,yes))csvRows.push([target==='coll'?'Colaborador':'Dependente',r.label,r.n]);
  csvRows.push([],['Observação','A base não informa se o colaborador tem dependentes. Instituições podem ser atuais ou desejadas. Uma pessoa pode citar várias instituições.'],['Consolidação','54 envios; 51 colaboradores únicos; envio mais recente por e-mail, com nome como alternativa. Fotografia da base, sem atualização automática.']);
  const csv='\ufeff'+csvRows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download='AGEFIS-educacao-resumo-2026-10-22.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('notification').textContent='Resumo CSV exportado com os filtros selecionados.';
}
async function init(){
  try{const response=await fetch('./data.json?v=3');if(!response.ok)throw new Error('data');data=await response.json();render();$('loading').hidden=true;$('dashboard').hidden=false;
    for(const key of ['vinculo','study','dep','scope'])$(key).addEventListener('change',()=>{expanded={coll:false,dep:false};render();});
    $('reset').addEventListener('click',()=>{for(const k of ['vinculo','study','dep'])$(k).value='';expanded={coll:false,dep:false};render();});
    for(const target of ['coll','dep'])$(target+'-more').addEventListener('click',()=>{expanded[target]=!expanded[target];renderRank(target);});
    $('export').addEventListener('click',exportCsv);
  }catch{$('loading').innerHTML='Não foi possível carregar os indicadores. <button class="button" id="retry" type="button">Tentar novamente</button>';$('retry').addEventListener('click',()=>location.reload());}
}
$('print').addEventListener('click',()=>window.print());
$('share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.origin+location.pathname);$('notification').textContent='Link do painel copiado. Pronto para compartilhar.';}catch{$('notification').textContent='Copie o endereço na barra do navegador para compartilhar o painel.';}});
init();
