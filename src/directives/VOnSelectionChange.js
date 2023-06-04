export default {
    mounted(el, binding, vnode, d) {
        document.selectionChange = () => {
            binding.value()
        };
        el.focusHandler = () => {
            document.addEventListener('selectionchange', document.selectionChange);
        };
        el.addEventListener('focus', el.focusHandler);
        el.blurHandler = () => {
            document.removeEventListener('selectionchange', document.selectionChange);
        };
        el.addEventListener('blur', el.blurHandler);
    },
    umounted(el, binding, vnode) {
        el.removeEventListener('focus', el.focusHandler);
        el.removeEventListener('blur', el.focusHandler);
        document.removeEventListener('selectionchange', binding.value);
        delete el.focusHandler;
        delete el.blurHandler;
    },
    name: 'onSelectionChange'
};