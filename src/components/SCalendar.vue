<template>
  <v-container class="pt-12 px-3">
    <v-sheet height="300">
      <v-row no-gutters>
        <v-col>
          <v-slider
              :max="60"
              :min="1"
              hide-details
              label="Minutes par interval"
              thumb-label="always"
              v-model="intervalMinutes"
          />
          <v-slider
              :max="60"
              :min="1"
              hide-details
              label="Hauteur des intervals"
              thumb-label="always"
              v-model="intervalHeight"
          />
        </v-col>
      </v-row>
      <v-calendar
          :end="end.format('YYYY-MM-DD')"
          :first-interval="firstInterval"
          :interval-count="intervalCount"
          :interval-height="intervalHeight"
          :interval-minutes="intervalMinutes"
          :short-intervals="false"
          :start="start.format('YYYY-MM-DD')"
          :weekdays="[1, 2, 3, 4, 5, 6]"
          locale="fr"
          ref="calendar"
          type="week"
      >
      </v-calendar>
    </v-sheet>
  </v-container>
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'SCalendar',

		data: () => ({
			firstInterval: 0,
			intervalMinutes: 15,
			intervalCount: 24,
			intervalHeight: 30
		}),

		created() {
			moment.locale('fr')
		},

		computed: {
			start() {
				return moment().startOf('week')
			},
			end() {
				return moment().endOf('week')
			}
		}

	}
</script>

<style scoped>

</style>
