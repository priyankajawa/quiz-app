


const isEmpty =(value) =>
value === undefined ||
value == null||
(typeof value === 'object' && Object.keys(value).length === 0) ||
(typeof value === 'string' && value.trim().length === 0);

export default isEmpty;

// const isEmpty =(value) =>

// console.log(isEmpty(undefined));  // true
// console.log(isEmpty(null));       // true
// console.log(isEmpty({}));         // true
// console.log(isEmpty(''));         // true
// console.log(isEmpty('   '));      // true
// console.log(isEmpty('Hello'));    // false
// console.log(isEmpty(42));         // false

//  export default isEmpty;