<template>
  <s-calendar>
    <template #event>
      Hello, world
    </template>
  </s-calendar>
</template>

<script>
	import SCalendar from '@/components/SCalendar'

	export default {
		name: 'CustomCalendar',
		components: {SCalendar}
	}
</script>

<style scoped>

</style>
