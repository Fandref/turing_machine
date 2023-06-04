export default {
    mounted(el, binding, vnode, d) {
        const refName = binding.value;
        el.handler = () => {
            binding.instance.$refs[refName].open();
        };
        el.addEventListener('click', el.handler);
    },
    umounted(el, binding, vnode) {
        delete el.handler;
        el.removeEventListener('click', el.handler);
    },
    name: 'modal'
};