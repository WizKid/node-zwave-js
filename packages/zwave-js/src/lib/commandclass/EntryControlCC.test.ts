import { CommandClasses } from "@zwave-js/core";
import type { Driver } from "../driver/Driver";
import { createEmptyMockDriver } from "../test/mocks";
import {
  EntryControlCommand,
  EntryControlDataTypes,
  EntryControlEventTypes,
  EntryControlCCConfigurationGet,
  EntryControlCCConfigurationSet,
  EntryControlCCConfigurationReport,
  EntryControlCCEventSupportedGet,
  EntryControlCCEventSupportedReport,
  EntryControlCCKeySupportedGet,
  EntryControlCCKeySupportedReport,
} from "./EntryControlCC";

const fakeDriver = (createEmptyMockDriver() as unknown) as Driver;

function buildCCBuffer(payload: Buffer): Buffer {
	return Buffer.concat([
		Buffer.from([
			CommandClasses["Entry Control"], // CC
		]),
		payload,
	]);
}

describe("lib/commandclass/EntryControlCC => ", () => {
	it("the ConfigurationGet command should serialize correctly", () => {
		const cc = new EntryControlCCConfigurationGet(fakeDriver, { nodeId: 1 });
		const expected = buildCCBuffer(
			Buffer.from([
				EntryControlCommand.ConfigurationGet, // CC Command
			]),
    );
		expect(cc.serialize()).toEqual(expected);
  });

	it("the ConfigurationSet command should serialize correctly", () => {
		const cc = new EntryControlCCConfigurationSet(fakeDriver, {
      nodeId: 1,
      keyCacheSize: 1,
      keyCacheTimeout: 2,
    });
		const expected = buildCCBuffer(
			Buffer.from([
        EntryControlCommand.ConfigurationSet, // CC Command
        0x1,
        0x2,
			]),
    );
		expect(cc.serialize()).toEqual(expected);
  });

  it("the ConfigurationReport command should be deserialize correctly", () => {
    const data = buildCCBuffer(
			Buffer.from([
        EntryControlCommand.ConfigurationReport, // CC Command
        0x1,
        0x2,
			]),
    );

		const cc = new EntryControlCCConfigurationReport(fakeDriver, {
      nodeId: 1,
      data
    });

    expect(cc.keyCachedSize).toEqual(1);
    expect(cc.keyCachedTimeout).toEqual(2);
  });

  it("the EventSupportedGet command should serialize correctly", () => {
		const cc = new EntryControlCCEventSupportedGet(fakeDriver, { nodeId: 1 });
		const expected = buildCCBuffer(
			Buffer.from([
				EntryControlCommand.EventSupportedGet, // CC Command
			]),
    );
		expect(cc.serialize()).toEqual(expected);
  });

  it("the EventSupportedReport command should be deserialize correctly", () => {
    const data = buildCCBuffer(
			Buffer.from([
        EntryControlCommand.EventSupportedReport, // CC Command
        1,
        0b00000100,
        4,
        0b01101000,
        0b00000000,
        0b00000000,
        0b00000010,
        0,
        5,
        1,
        10,
			]),
    );

		const cc = new EntryControlCCEventSupportedReport(fakeDriver, {
      nodeId: 1,
      data
    });

    expect(cc.dataTypeSupported).toEqual([EntryControlDataTypes.Ascii]);
    expect(cc.eventTypeSupported).toEqual([
      EntryControlEventTypes.DisarmAll,
      EntryControlEventTypes.ArmAway,
      EntryControlEventTypes.ArmHome,
      EntryControlEventTypes.Cancel,
    ]);
    expect(cc.keyCachedSizeMin).toEqual(0);
    expect(cc.keyCachedSizeMax).toEqual(5);
    expect(cc.keyCachedTimeoutMin).toEqual(1);
    expect(cc.keyCachedTimeoutMax).toEqual(10);
  });

  it("the KeySupportedGet command should serialize correctly", () => {
		const cc = new EntryControlCCKeySupportedGet(fakeDriver, { nodeId: 1 });
		const expected = buildCCBuffer(
			Buffer.from([
				EntryControlCommand.KeySupportedGet, // CC Command
			]),
    );
		expect(cc.serialize()).toEqual(expected);
  });

  it("the KeySupportedReport command should be deserialize correctly", () => {
    const data = buildCCBuffer(
			Buffer.from([
        EntryControlCommand.KeySupportedReport, // CC Command
        1,
        0b01011010,
			]),
    );

		const cc = new EntryControlCCKeySupportedReport(fakeDriver, {
      nodeId: 1,
      data
    });

    expect(cc.keySupported).toEqual([1,3,4,6]);
  });
});