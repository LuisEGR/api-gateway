
export function smallJSON(key: string, value: any) {

    if (Array.isArray(value)) {
        if (value.length > 5) {
            value = value.slice(1, 10);
        }
        return value;
    }

    if (typeof value === 'string' && value.length > 100) {
        const charsToShow = 15;
        let val = '';
        val += value.substr(0, charsToShow);
        val += '[...]';
        val += value.substr(-charsToShow, charsToShow);
        return val;
    }
    return value;

}
