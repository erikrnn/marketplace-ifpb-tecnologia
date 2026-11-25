// Junta nomes de classes CSS, ignorando valores vazios.
// juntarClasses('a', false, 'b', undefined)  ->  'a b'
export function juntarClasses(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ');
}