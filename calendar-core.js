/* Persian calendar conversion via the browser's standardized Intl calendar data. */
(function(root){'use strict';
const numeric=new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn',{calendar:'persian',year:'numeric',month:'numeric',day:'numeric',timeZone:'UTC'});
const display=new Intl.DateTimeFormat('fa-IR',{calendar:'persian',year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
const months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];const cache=new Map();
function parse(iso){if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))return null;const d=new Date(iso+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===iso?d:null}
function parts(value){const d=value instanceof Date?value:parse(value);if(!d||!Number.isFinite(+d))return null;const p=Object.fromEntries(numeric.formatToParts(d).map(x=>[x.type,x.value]));return {year:+p.year,month:+p.month,day:+p.day}}
function newYear(year){if(!Number.isInteger(year)||year<1200||year>1601)throw RangeError('Unsupported Persian year');if(cache.has(year))return cache.get(year);for(let day=17;day<=24;day++){const d=new Date(Date.UTC(year+621,2,day,12));const p=parts(d);if(p.year===year&&p.month===1&&p.day===1){cache.set(year,+d);return +d}}throw RangeError('Persian new year not found')}
function monthLength(year,month){if(!Number.isInteger(month)||month<1||month>12)throw RangeError('Invalid month');if(month<7)return 31;if(month<12)return 30;return Math.round((newYear(year+1)-newYear(year))/86400000)-336}
function toIso(year,month,day){if(!Number.isInteger(day)||day<1||day>monthLength(year,month))throw RangeError('Invalid Persian day');const offset=month<=7?(month-1)*31:186+(month-7)*30;return new Date(newYear(year)+(offset+day-1)*86400000).toISOString().slice(0,10)}
function format(iso){const d=parse(iso);return d?display.format(d):iso||''}
function addDays(iso,n){const d=parse(iso);if(!d)throw RangeError('Invalid ISO date');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
const api={parts,toIso,monthLength,format,addDays,today,parse,months};root.KalayeCalendar=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
