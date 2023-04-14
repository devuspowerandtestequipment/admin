import numeral from 'numeral'

export function priceShow(amount) {

    var number = numeral(amount);
    numeral.defaultFormat('0,0.00');

    return '₹'+number.format();
}