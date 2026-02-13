export const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) return '0,00 DT';
    return `${price.toFixed(2).replace('.', ',')} DT`;
};
