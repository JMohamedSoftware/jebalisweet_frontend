export const formatPrice = (price: number | string | null | undefined): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice === null || numPrice === undefined || isNaN(numPrice)) return '0,00 DT';
    return `${numPrice.toFixed(2).replace('.', ',')} DT`;
};
