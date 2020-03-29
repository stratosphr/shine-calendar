<template>
  <v-container>
    <v-row
        class="fill-height elevation-3"
        no-gutters
    >
      <v-col cols="auto">
        <v-tabs
            center
            center-active
            hide-slider
            icons-and-text
            v-model="category"
            vertical
        >
          <v-tab
              :class="`${category.color} lighten-4`"
              :href="`#tab-${categoryIndex}`"
              :key="categoryIndex"
              :ripple="false"
              v-for="(category, categoryIndex) in categories"
          >
            <span :class="`${category.color}--text font-weight-bold`">{{category.text}}</span>
            <v-icon
                :color="category.color"
                left
                v-text="category.icon"
            />
          </v-tab>
          <v-tab :href="`#tab-${categories.length}`">
            <span
                :class="`font-weight-bold`"
                v-text="'Ajouter...'"
            />
            <v-icon
                left
                v-text="'mdi-plus'"
            />
          </v-tab>
        </v-tabs>
      </v-col>

      <v-col>
        <v-tabs-items
            class="fill-height"
            v-model="category"
            vertical
        >
          <v-tab-item
              :key="categoryIndex"
              :value="`tab-${categoryIndex}`"
              class="fill-height"
              v-for="(category, categoryIndex) in categories"
          >
            <div :class="`${category.color} lighten-4 pa-3 fill-height`">
              <v-data-table height="200">
              </v-data-table>
            </div>
          </v-tab-item>
          <v-tab-item
              :value="`tab-${categories.length}`"
              class="fill-height"
          >
            <div :class="`pa-3 fill-height`">
              <v-card
                  flat
                  tile
              >
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="auto">
                      <v-combobox
                          :items="categories"
                          dense
                          hide-details
                          label="Catégorie"
                          prepend-icon="mdi-format-list-bulleted-type"
                          return-object
                          single-line
                          solo
                      >
                        <template #item="{item}">
                          <v-icon
                              :color="item.color"
                              left
                              v-text="item.icon"
                          />
                          <span :class="`${item.color}--text font-weight-bold`">{{item.text}}</span>
                        </template>
                        <template #selection="{item}">
                          <v-icon
                              :color="item.color"
                              left
                              v-text="item.icon"
                          />
                          <span :class="`${item.color}--text font-weight-bold`">{{item.text}}</span>
                        </template>
                      </v-combobox>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
	export default {
		name: 'EventCreator',

		data: () => ({
			category: 'tab-3',
			categories: [
				{
					text: 'C.M',
					value: 'cm',
					icon: 'mdi-teach',
					color: 'cyan'
				},
				{
					text: 'T.D.',
					value: 'td',
					icon: 'mdi-pen',
					color: 'teal'
				},
				{
					text: 'T.P.',
					value: 'tp',
					icon: 'mdi-test-tube',
					color: 'purple'
				}
			]
		})

	}
</script>
