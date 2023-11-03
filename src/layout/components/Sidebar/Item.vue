<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      // if (icon.includes('el-icon')) {
      //   vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      // } else {
      //   vnodes.push(<svg-icon icon-class={icon}/>)
      // }
      if (icon.includes('el-icon')) {
        vnodes.push(
          <i class={['sub-el-icon', 'icon-container', icon]} />
        )
      } else {
        // Assuming you have a CSS class for your custom icons
        vnodes.push(
          <svg-icon icon-class={icon} class='icon-container' />
        )
      }
    }

    if (title) {
      vnodes.push(<span class='sidebarSpan' slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.icon-container{
  font-size: 17px;
}
.sidebarSpan{
    font-size: 17px;
  }
</style>
