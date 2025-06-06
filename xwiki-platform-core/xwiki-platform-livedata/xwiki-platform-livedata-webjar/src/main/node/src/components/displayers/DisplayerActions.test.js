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

import DisplayerActions from "./DisplayerActions.vue";
import { initWrapper } from "./displayerTestsHelper";
import { afterEach, describe, expect, it } from "vitest";
import sinon from "sinon";

describe("DisplayerActions.vue", () => {
  afterEach(function() {
    // completely restore all fakes created through the sandbox
    sinon.restore();
  });

  it("Renders an entry in view mode", () => {
    const wrapper = initWrapper(DisplayerActions, {});
    expect(wrapper.text()).toMatch("jump");
  });

  it("Renders an entry with no actions to display", () => {
    const wrapper = initWrapper(DisplayerActions, {
      logic: {
        getDisplayerDescriptor() {
          return {
            actions: [],
          };
        },
        isActionAllowed() {
          return false;
        },
      },
    });
    expect(wrapper.text()).toMatch("");
  });
});
