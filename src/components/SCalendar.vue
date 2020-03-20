<template>
  <v-sheet height="300">
    <v-calendar
        :end="end"
        :short-intervals="false"
        :start="start"
        :weekdays="[1, 2, 3, 4, 5, 6]"
        locale="fr"
        ref="calendar"
        type="week"
    >
    </v-calendar>
  </v-sheet>
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'SCalendar',

		created() {
			console.clear()
			moment.locale('fr')
		},

		computed: {
			start() {
				return moment('2020-03-20').startOf('week').format('YYYY-MM-DD')
			},
			end() {
				return moment('2020-03-23').endOf('week').format('YYYY-MM-DD')
			}
		}

	}
</script>

<style scoped>

</style>
