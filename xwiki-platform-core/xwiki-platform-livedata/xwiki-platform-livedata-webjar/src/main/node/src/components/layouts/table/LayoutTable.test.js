/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
import { shallowMount } from "@vue/test-utils";
import _ from "lodash";
import LayoutTable from "./LayoutTable.vue";
import LayoutTableRow from "./LayoutTableRow.vue";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";

/**
 * Vue Component initializer for LayoutTable component. Since this component creates a deep
 * hierarchy of sub-components, we use `shallowMount` to initialize the wrapper.
 *
 * The default option object is:
 * ```
 * {
 *   provide: {
 *     logic: {
 *       canAddEntry: () => false,
 *       getEntryId: (e) => e.id,
 *       data: {
 *         data: {
 *           entries: []
 *         }
 *       }
 *     }
 *   },
 *   mocks: {
 *     $t: (key) => key
 *   }
 * }
 * ```
 * The default option object is merged with the `option` parameter.
 *
 * @param options an optional option object use to customize the initialized component
 * @param afterEntryFetchWrapper wrapper for the afterEntryFetch event. The callback is stored in
 *   the callback field of the object passed in parameter
 * @returns {*} a shallow wrapper for the LayoutTable component
 */
function initWrapper({ options, afterEntryFetchWrapper }) {
  return shallowMount(LayoutTable, _.merge({
    global: {
      provide: {
        logic: {
          canAddEntry: () => false,
          getEntryId: (e) => e.id,
          onEvent: (eventName, callback) => {
            if (afterEntryFetchWrapper) {
              afterEntryFetchWrapper.callback = callback;
            }
          },
          data: {
            data: {
              entries: [],
            },
          },
        },
      },
      mocks: {
        $t: (key) => key,
      },
      renderStubDefaultSlot: true,
    },
  }, options));
}

describe("LayoutTable.vue", () => {
  it("Renders when no entries", async () => {
    const afterEntryFetchWrapper = {};
    const wrapper = initWrapper({ afterEntryFetchWrapper });
    // Before afterEntryFetch is fired, the message is not displayed, and is only displayed once
    // data are fetched but the number of entries is still 0.
    expect(wrapper.findAll(".noentries-table").length).toBe(0);
    // Manual trigger of the afterEntryFetch event.
    afterEntryFetchWrapper.callback();
    await nextTick();
    expect(wrapper.find(".noentries-table").text()).toBe("livedata.bottombar.noEntries");
  });

  it("Renders with some entries", async () => {
    const afterEntryFetchWrapper = {};
    const wrapper = initWrapper({
      options: {
        global: {
          provide: {
            logic: {
              data: {
                data: {
                  entries: [
                    { id: 1 },
                  ],
                },
              },
            },
          },
        },
      },
      afterEntryFetchWrapper,
    });
    // Manual trigger of the afterEntryFetch event.
    afterEntryFetchWrapper.callback();
    await nextTick();
    const rows = wrapper.findAllComponents(LayoutTableRow);
    expect(rows.length).toBe(1);
    expect(rows.at(0).props()).toStrictEqual({
      entry: { id: 1 },
      entryIdx: 0,
    });
    expect(wrapper.find(".noentries-card").exists()).toBe(false);
  });
});
