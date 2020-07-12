import Vue from 'vue'

export function thousand(value) {
    if (value) {
		var x = value.toString();
		var pattern = /(-?\d+)(\d{3})/;
		while (pattern.test(x))
			x = x.replace(pattern, "$1,$2");
		return x;
	}else{
		return '0';
	}
} 

export function toUSD(value) { 
   return `$${value}`; 
} 
export function Pembulatan(value) { 
    return Math.round(value);
 } 

const filters = { thousand, toUSD,Pembulatan } 


Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
    })
    
    export default filters