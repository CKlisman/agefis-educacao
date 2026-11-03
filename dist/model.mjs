export const types = ['Efetivo', 'Comissionado', 'Terceirizado', 'Estagiário'];
export const statuses = ['Sim', 'Não', 'Não informado'];
export function select(groups, filters = {}) {
  return groups.filter(g => ['vinculo', 'study', 'dep'].every(k => !filters[k] || g[k] === filters[k]));
}
export function countBy(groups, key, values) {
  return values.map(label => ({label, n: groups.filter(g => g[key] === label).reduce((s,g) => s+g.n,0)}));
}
export function total(groups) { return groups.reduce((s,g) => s+g.n,0); }
export function ranking(groups, target, onlyYes = true) {
  const result = {};
  const field = target === 'coll' ? 'study' : 'dep';
  for (const g of groups) {
    if (onlyYes && g[field] !== 'Sim') continue;
    for (const [name, n] of Object.entries(g[target === 'coll' ? 'collInstitutions' : 'depInstitutions'])) result[name] = (result[name] || 0) + n;
  }
  return Object.entries(result).map(([label,n]) => ({label,n})).sort((a,b) => b.n-a.n || a.label.localeCompare(b.label,'pt-BR'));
}
export function percent(n, denominator) {
  return denominator ? (100*n/denominator).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%' : '0%';
}
