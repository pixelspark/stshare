/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "protocol";

export enum FileInfoType {
  FILE_INFO_TYPE_FILE = 0,
  FILE_INFO_TYPE_DIRECTORY = 1,
  /** @deprecated */
  FILE_INFO_TYPE_SYMLINK_FILE = 2,
  /** @deprecated */
  FILE_INFO_TYPE_SYMLINK_DIRECTORY = 3,
  FILE_INFO_TYPE_SYMLINK = 4,
  UNRECOGNIZED = -1,
}

export function fileInfoTypeFromJSON(object: any): FileInfoType {
  switch (object) {
    case 0:
    case "FILE_INFO_TYPE_FILE":
      return FileInfoType.FILE_INFO_TYPE_FILE;
    case 1:
    case "FILE_INFO_TYPE_DIRECTORY":
      return FileInfoType.FILE_INFO_TYPE_DIRECTORY;
    case 2:
    case "FILE_INFO_TYPE_SYMLINK_FILE":
      return FileInfoType.FILE_INFO_TYPE_SYMLINK_FILE;
    case 3:
    case "FILE_INFO_TYPE_SYMLINK_DIRECTORY":
      return FileInfoType.FILE_INFO_TYPE_SYMLINK_DIRECTORY;
    case 4:
    case "FILE_INFO_TYPE_SYMLINK":
      return FileInfoType.FILE_INFO_TYPE_SYMLINK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return FileInfoType.UNRECOGNIZED;
  }
}

export function fileInfoTypeToJSON(object: FileInfoType): string {
  switch (object) {
    case FileInfoType.FILE_INFO_TYPE_FILE:
      return "FILE_INFO_TYPE_FILE";
    case FileInfoType.FILE_INFO_TYPE_DIRECTORY:
      return "FILE_INFO_TYPE_DIRECTORY";
    case FileInfoType.FILE_INFO_TYPE_SYMLINK_FILE:
      return "FILE_INFO_TYPE_SYMLINK_FILE";
    case FileInfoType.FILE_INFO_TYPE_SYMLINK_DIRECTORY:
      return "FILE_INFO_TYPE_SYMLINK_DIRECTORY";
    case FileInfoType.FILE_INFO_TYPE_SYMLINK:
      return "FILE_INFO_TYPE_SYMLINK";
    case FileInfoType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * The field ordering here optimizes for struct size / alignment --
 * large types come before smaller ones.
 */
export interface FileInfo {
  name: string;
  size: bigint;
  modifiedS: bigint;
  modifiedBy: bigint;
  version: Vector | undefined;
  sequence: bigint;
  blocks: BlockInfo[];
  symlinkTarget: string;
  blocksHash: Uint8Array;
  encrypted: Uint8Array;
  type: FileInfoType;
  permissions: number;
  modifiedNs: number;
  blockSize: number;
  platform:
    | PlatformData
    | undefined;
  /**
   * The local_flags fields stores flags that are relevant to the local
   * host only. It is not part of the protocol, doesn't get sent or
   * received (we make sure to zero it), nonetheless we need it on our
   * struct and to be able to serialize it to/from the database.
   */
  localFlags: number;
  /**
   * The version_hash is an implementation detail and not part of the wire
   * format.
   */
  versionHash: Uint8Array;
  /**
   * The time when the inode was last changed (i.e., permissions, xattrs
   * etc changed). This is host-local, not sent over the wire.
   */
  inodeChangeNs: bigint;
  /**
   * The size of the data appended to the encrypted file on disk. This is
   * host-local, not sent over the wire.
   */
  encryptionTrailerSize: number;
  deleted: boolean;
  invalid: boolean;
  noPermissions: boolean;
}

export interface BlockInfo {
  hash: Uint8Array;
  offset: bigint;
  size: number;
  weakHash: number;
}

export interface Vector {
  counters: Counter[];
}

export interface Counter {
  id: bigint;
  value: bigint;
}

export interface PlatformData {
  unix: UnixData | undefined;
  windows: WindowsData | undefined;
  linux: XattrData | undefined;
  darwin: XattrData | undefined;
  freebsd: XattrData | undefined;
  netbsd: XattrData | undefined;
}

export interface UnixData {
  /**
   * The owner name and group name are set when known (i.e., could be
   * resolved on the source device), while the UID and GID are always set
   * as they come directly from the stat() call.
   */
  ownerName: string;
  groupName: string;
  uid: number;
  gid: number;
}

export interface WindowsData {
  /**
   * Windows file objects have a single owner, which may be a user or a
   * group. We keep the name of that account, and a flag to indicate what
   * type it is.
   */
  ownerName: string;
  ownerIsGroup: boolean;
}

export interface XattrData {
  xattrs: Xattr[];
}

export interface Xattr {
  name: string;
  value: Uint8Array;
}

function createBaseFileInfo(): FileInfo {
  return {
    name: "",
    size: BigInt("0"),
    modifiedS: BigInt("0"),
    modifiedBy: BigInt("0"),
    version: undefined,
    sequence: BigInt("0"),
    blocks: [],
    symlinkTarget: "",
    blocksHash: new Uint8Array(0),
    encrypted: new Uint8Array(0),
    type: 0,
    permissions: 0,
    modifiedNs: 0,
    blockSize: 0,
    platform: undefined,
    localFlags: 0,
    versionHash: new Uint8Array(0),
    inodeChangeNs: BigInt("0"),
    encryptionTrailerSize: 0,
    deleted: false,
    invalid: false,
    noPermissions: false,
  };
}

export const FileInfo = {
  encode(message: FileInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.size !== BigInt("0")) {
      if (BigInt.asIntN(64, message.size) !== message.size) {
        throw new globalThis.Error("value provided for field message.size of type int64 too large");
      }
      writer.uint32(24).int64(message.size.toString());
    }
    if (message.modifiedS !== BigInt("0")) {
      if (BigInt.asIntN(64, message.modifiedS) !== message.modifiedS) {
        throw new globalThis.Error("value provided for field message.modifiedS of type int64 too large");
      }
      writer.uint32(40).int64(message.modifiedS.toString());
    }
    if (message.modifiedBy !== BigInt("0")) {
      if (BigInt.asUintN(64, message.modifiedBy) !== message.modifiedBy) {
        throw new globalThis.Error("value provided for field message.modifiedBy of type uint64 too large");
      }
      writer.uint32(96).uint64(message.modifiedBy.toString());
    }
    if (message.version !== undefined) {
      Vector.encode(message.version, writer.uint32(74).fork()).ldelim();
    }
    if (message.sequence !== BigInt("0")) {
      if (BigInt.asIntN(64, message.sequence) !== message.sequence) {
        throw new globalThis.Error("value provided for field message.sequence of type int64 too large");
      }
      writer.uint32(80).int64(message.sequence.toString());
    }
    for (const v of message.blocks) {
      BlockInfo.encode(v!, writer.uint32(130).fork()).ldelim();
    }
    if (message.symlinkTarget !== "") {
      writer.uint32(138).string(message.symlinkTarget);
    }
    if (message.blocksHash.length !== 0) {
      writer.uint32(146).bytes(message.blocksHash);
    }
    if (message.encrypted.length !== 0) {
      writer.uint32(154).bytes(message.encrypted);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.permissions !== 0) {
      writer.uint32(32).uint32(message.permissions);
    }
    if (message.modifiedNs !== 0) {
      writer.uint32(88).int32(message.modifiedNs);
    }
    if (message.blockSize !== 0) {
      writer.uint32(104).int32(message.blockSize);
    }
    if (message.platform !== undefined) {
      PlatformData.encode(message.platform, writer.uint32(114).fork()).ldelim();
    }
    if (message.localFlags !== 0) {
      writer.uint32(8000).uint32(message.localFlags);
    }
    if (message.versionHash.length !== 0) {
      writer.uint32(8010).bytes(message.versionHash);
    }
    if (message.inodeChangeNs !== BigInt("0")) {
      if (BigInt.asIntN(64, message.inodeChangeNs) !== message.inodeChangeNs) {
        throw new globalThis.Error("value provided for field message.inodeChangeNs of type int64 too large");
      }
      writer.uint32(8016).int64(message.inodeChangeNs.toString());
    }
    if (message.encryptionTrailerSize !== 0) {
      writer.uint32(8024).int32(message.encryptionTrailerSize);
    }
    if (message.deleted !== false) {
      writer.uint32(48).bool(message.deleted);
    }
    if (message.invalid !== false) {
      writer.uint32(56).bool(message.invalid);
    }
    if (message.noPermissions !== false) {
      writer.uint32(64).bool(message.noPermissions);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.size = longToBigint(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.modifiedS = longToBigint(reader.int64() as Long);
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.modifiedBy = longToBigint(reader.uint64() as Long);
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.version = Vector.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.sequence = longToBigint(reader.int64() as Long);
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.blocks.push(BlockInfo.decode(reader, reader.uint32()));
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.symlinkTarget = reader.string();
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.blocksHash = reader.bytes();
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.encrypted = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.permissions = reader.uint32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.modifiedNs = reader.int32();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.blockSize = reader.int32();
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.platform = PlatformData.decode(reader, reader.uint32());
          continue;
        case 1000:
          if (tag !== 8000) {
            break;
          }

          message.localFlags = reader.uint32();
          continue;
        case 1001:
          if (tag !== 8010) {
            break;
          }

          message.versionHash = reader.bytes();
          continue;
        case 1002:
          if (tag !== 8016) {
            break;
          }

          message.inodeChangeNs = longToBigint(reader.int64() as Long);
          continue;
        case 1003:
          if (tag !== 8024) {
            break;
          }

          message.encryptionTrailerSize = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.deleted = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.invalid = reader.bool();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.noPermissions = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FileInfo {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      size: isSet(object.size) ? BigInt(object.size) : BigInt("0"),
      modifiedS: isSet(object.modifiedS) ? BigInt(object.modifiedS) : BigInt("0"),
      modifiedBy: isSet(object.modifiedBy) ? BigInt(object.modifiedBy) : BigInt("0"),
      version: isSet(object.version) ? Vector.fromJSON(object.version) : undefined,
      sequence: isSet(object.sequence) ? BigInt(object.sequence) : BigInt("0"),
      blocks: globalThis.Array.isArray(object?.blocks) ? object.blocks.map((e: any) => BlockInfo.fromJSON(e)) : [],
      symlinkTarget: isSet(object.symlinkTarget) ? globalThis.String(object.symlinkTarget) : "",
      blocksHash: isSet(object.blocksHash) ? bytesFromBase64(object.blocksHash) : new Uint8Array(0),
      encrypted: isSet(object.encrypted) ? bytesFromBase64(object.encrypted) : new Uint8Array(0),
      type: isSet(object.type) ? fileInfoTypeFromJSON(object.type) : 0,
      permissions: isSet(object.permissions) ? globalThis.Number(object.permissions) : 0,
      modifiedNs: isSet(object.modifiedNs) ? globalThis.Number(object.modifiedNs) : 0,
      blockSize: isSet(object.blockSize) ? globalThis.Number(object.blockSize) : 0,
      platform: isSet(object.platform) ? PlatformData.fromJSON(object.platform) : undefined,
      localFlags: isSet(object.localFlags) ? globalThis.Number(object.localFlags) : 0,
      versionHash: isSet(object.versionHash) ? bytesFromBase64(object.versionHash) : new Uint8Array(0),
      inodeChangeNs: isSet(object.inodeChangeNs) ? BigInt(object.inodeChangeNs) : BigInt("0"),
      encryptionTrailerSize: isSet(object.encryptionTrailerSize) ? globalThis.Number(object.encryptionTrailerSize) : 0,
      deleted: isSet(object.deleted) ? globalThis.Boolean(object.deleted) : false,
      invalid: isSet(object.invalid) ? globalThis.Boolean(object.invalid) : false,
      noPermissions: isSet(object.noPermissions) ? globalThis.Boolean(object.noPermissions) : false,
    };
  },

  toJSON(message: FileInfo): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.size !== BigInt("0")) {
      obj.size = message.size.toString();
    }
    if (message.modifiedS !== BigInt("0")) {
      obj.modifiedS = message.modifiedS.toString();
    }
    if (message.modifiedBy !== BigInt("0")) {
      obj.modifiedBy = message.modifiedBy.toString();
    }
    if (message.version !== undefined) {
      obj.version = Vector.toJSON(message.version);
    }
    if (message.sequence !== BigInt("0")) {
      obj.sequence = message.sequence.toString();
    }
    if (message.blocks?.length) {
      obj.blocks = message.blocks.map((e) => BlockInfo.toJSON(e));
    }
    if (message.symlinkTarget !== "") {
      obj.symlinkTarget = message.symlinkTarget;
    }
    if (message.blocksHash.length !== 0) {
      obj.blocksHash = base64FromBytes(message.blocksHash);
    }
    if (message.encrypted.length !== 0) {
      obj.encrypted = base64FromBytes(message.encrypted);
    }
    if (message.type !== 0) {
      obj.type = fileInfoTypeToJSON(message.type);
    }
    if (message.permissions !== 0) {
      obj.permissions = Math.round(message.permissions);
    }
    if (message.modifiedNs !== 0) {
      obj.modifiedNs = Math.round(message.modifiedNs);
    }
    if (message.blockSize !== 0) {
      obj.blockSize = Math.round(message.blockSize);
    }
    if (message.platform !== undefined) {
      obj.platform = PlatformData.toJSON(message.platform);
    }
    if (message.localFlags !== 0) {
      obj.localFlags = Math.round(message.localFlags);
    }
    if (message.versionHash.length !== 0) {
      obj.versionHash = base64FromBytes(message.versionHash);
    }
    if (message.inodeChangeNs !== BigInt("0")) {
      obj.inodeChangeNs = message.inodeChangeNs.toString();
    }
    if (message.encryptionTrailerSize !== 0) {
      obj.encryptionTrailerSize = Math.round(message.encryptionTrailerSize);
    }
    if (message.deleted !== false) {
      obj.deleted = message.deleted;
    }
    if (message.invalid !== false) {
      obj.invalid = message.invalid;
    }
    if (message.noPermissions !== false) {
      obj.noPermissions = message.noPermissions;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FileInfo>, I>>(base?: I): FileInfo {
    return FileInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FileInfo>, I>>(object: I): FileInfo {
    const message = createBaseFileInfo();
    message.name = object.name ?? "";
    message.size = object.size ?? BigInt("0");
    message.modifiedS = object.modifiedS ?? BigInt("0");
    message.modifiedBy = object.modifiedBy ?? BigInt("0");
    message.version = (object.version !== undefined && object.version !== null)
      ? Vector.fromPartial(object.version)
      : undefined;
    message.sequence = object.sequence ?? BigInt("0");
    message.blocks = object.blocks?.map((e) => BlockInfo.fromPartial(e)) || [];
    message.symlinkTarget = object.symlinkTarget ?? "";
    message.blocksHash = object.blocksHash ?? new Uint8Array(0);
    message.encrypted = object.encrypted ?? new Uint8Array(0);
    message.type = object.type ?? 0;
    message.permissions = object.permissions ?? 0;
    message.modifiedNs = object.modifiedNs ?? 0;
    message.blockSize = object.blockSize ?? 0;
    message.platform = (object.platform !== undefined && object.platform !== null)
      ? PlatformData.fromPartial(object.platform)
      : undefined;
    message.localFlags = object.localFlags ?? 0;
    message.versionHash = object.versionHash ?? new Uint8Array(0);
    message.inodeChangeNs = object.inodeChangeNs ?? BigInt("0");
    message.encryptionTrailerSize = object.encryptionTrailerSize ?? 0;
    message.deleted = object.deleted ?? false;
    message.invalid = object.invalid ?? false;
    message.noPermissions = object.noPermissions ?? false;
    return message;
  },
};

function createBaseBlockInfo(): BlockInfo {
  return { hash: new Uint8Array(0), offset: BigInt("0"), size: 0, weakHash: 0 };
}

export const BlockInfo = {
  encode(message: BlockInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash.length !== 0) {
      writer.uint32(26).bytes(message.hash);
    }
    if (message.offset !== BigInt("0")) {
      if (BigInt.asIntN(64, message.offset) !== message.offset) {
        throw new globalThis.Error("value provided for field message.offset of type int64 too large");
      }
      writer.uint32(8).int64(message.offset.toString());
    }
    if (message.size !== 0) {
      writer.uint32(16).int32(message.size);
    }
    if (message.weakHash !== 0) {
      writer.uint32(32).uint32(message.weakHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BlockInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlockInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          if (tag !== 26) {
            break;
          }

          message.hash = reader.bytes();
          continue;
        case 1:
          if (tag !== 8) {
            break;
          }

          message.offset = longToBigint(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.size = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.weakHash = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BlockInfo {
    return {
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(0),
      offset: isSet(object.offset) ? BigInt(object.offset) : BigInt("0"),
      size: isSet(object.size) ? globalThis.Number(object.size) : 0,
      weakHash: isSet(object.weakHash) ? globalThis.Number(object.weakHash) : 0,
    };
  },

  toJSON(message: BlockInfo): unknown {
    const obj: any = {};
    if (message.hash.length !== 0) {
      obj.hash = base64FromBytes(message.hash);
    }
    if (message.offset !== BigInt("0")) {
      obj.offset = message.offset.toString();
    }
    if (message.size !== 0) {
      obj.size = Math.round(message.size);
    }
    if (message.weakHash !== 0) {
      obj.weakHash = Math.round(message.weakHash);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BlockInfo>, I>>(base?: I): BlockInfo {
    return BlockInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BlockInfo>, I>>(object: I): BlockInfo {
    const message = createBaseBlockInfo();
    message.hash = object.hash ?? new Uint8Array(0);
    message.offset = object.offset ?? BigInt("0");
    message.size = object.size ?? 0;
    message.weakHash = object.weakHash ?? 0;
    return message;
  },
};

function createBaseVector(): Vector {
  return { counters: [] };
}

export const Vector = {
  encode(message: Vector, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.counters) {
      Counter.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vector {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVector();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.counters.push(Counter.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Vector {
    return {
      counters: globalThis.Array.isArray(object?.counters) ? object.counters.map((e: any) => Counter.fromJSON(e)) : [],
    };
  },

  toJSON(message: Vector): unknown {
    const obj: any = {};
    if (message.counters?.length) {
      obj.counters = message.counters.map((e) => Counter.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vector>, I>>(base?: I): Vector {
    return Vector.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vector>, I>>(object: I): Vector {
    const message = createBaseVector();
    message.counters = object.counters?.map((e) => Counter.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCounter(): Counter {
  return { id: BigInt("0"), value: BigInt("0") };
}

export const Counter = {
  encode(message: Counter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== BigInt("0")) {
      if (BigInt.asUintN(64, message.id) !== message.id) {
        throw new globalThis.Error("value provided for field message.id of type uint64 too large");
      }
      writer.uint32(8).uint64(message.id.toString());
    }
    if (message.value !== BigInt("0")) {
      if (BigInt.asUintN(64, message.value) !== message.value) {
        throw new globalThis.Error("value provided for field message.value of type uint64 too large");
      }
      writer.uint32(16).uint64(message.value.toString());
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Counter {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCounter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.id = longToBigint(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = longToBigint(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Counter {
    return {
      id: isSet(object.id) ? BigInt(object.id) : BigInt("0"),
      value: isSet(object.value) ? BigInt(object.value) : BigInt("0"),
    };
  },

  toJSON(message: Counter): unknown {
    const obj: any = {};
    if (message.id !== BigInt("0")) {
      obj.id = message.id.toString();
    }
    if (message.value !== BigInt("0")) {
      obj.value = message.value.toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Counter>, I>>(base?: I): Counter {
    return Counter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Counter>, I>>(object: I): Counter {
    const message = createBaseCounter();
    message.id = object.id ?? BigInt("0");
    message.value = object.value ?? BigInt("0");
    return message;
  },
};

function createBasePlatformData(): PlatformData {
  return {
    unix: undefined,
    windows: undefined,
    linux: undefined,
    darwin: undefined,
    freebsd: undefined,
    netbsd: undefined,
  };
}

export const PlatformData = {
  encode(message: PlatformData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.unix !== undefined) {
      UnixData.encode(message.unix, writer.uint32(10).fork()).ldelim();
    }
    if (message.windows !== undefined) {
      WindowsData.encode(message.windows, writer.uint32(18).fork()).ldelim();
    }
    if (message.linux !== undefined) {
      XattrData.encode(message.linux, writer.uint32(26).fork()).ldelim();
    }
    if (message.darwin !== undefined) {
      XattrData.encode(message.darwin, writer.uint32(34).fork()).ldelim();
    }
    if (message.freebsd !== undefined) {
      XattrData.encode(message.freebsd, writer.uint32(42).fork()).ldelim();
    }
    if (message.netbsd !== undefined) {
      XattrData.encode(message.netbsd, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PlatformData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlatformData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.unix = UnixData.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.windows = WindowsData.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.linux = XattrData.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.darwin = XattrData.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.freebsd = XattrData.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.netbsd = XattrData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlatformData {
    return {
      unix: isSet(object.unix) ? UnixData.fromJSON(object.unix) : undefined,
      windows: isSet(object.windows) ? WindowsData.fromJSON(object.windows) : undefined,
      linux: isSet(object.linux) ? XattrData.fromJSON(object.linux) : undefined,
      darwin: isSet(object.darwin) ? XattrData.fromJSON(object.darwin) : undefined,
      freebsd: isSet(object.freebsd) ? XattrData.fromJSON(object.freebsd) : undefined,
      netbsd: isSet(object.netbsd) ? XattrData.fromJSON(object.netbsd) : undefined,
    };
  },

  toJSON(message: PlatformData): unknown {
    const obj: any = {};
    if (message.unix !== undefined) {
      obj.unix = UnixData.toJSON(message.unix);
    }
    if (message.windows !== undefined) {
      obj.windows = WindowsData.toJSON(message.windows);
    }
    if (message.linux !== undefined) {
      obj.linux = XattrData.toJSON(message.linux);
    }
    if (message.darwin !== undefined) {
      obj.darwin = XattrData.toJSON(message.darwin);
    }
    if (message.freebsd !== undefined) {
      obj.freebsd = XattrData.toJSON(message.freebsd);
    }
    if (message.netbsd !== undefined) {
      obj.netbsd = XattrData.toJSON(message.netbsd);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlatformData>, I>>(base?: I): PlatformData {
    return PlatformData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlatformData>, I>>(object: I): PlatformData {
    const message = createBasePlatformData();
    message.unix = (object.unix !== undefined && object.unix !== null) ? UnixData.fromPartial(object.unix) : undefined;
    message.windows = (object.windows !== undefined && object.windows !== null)
      ? WindowsData.fromPartial(object.windows)
      : undefined;
    message.linux = (object.linux !== undefined && object.linux !== null)
      ? XattrData.fromPartial(object.linux)
      : undefined;
    message.darwin = (object.darwin !== undefined && object.darwin !== null)
      ? XattrData.fromPartial(object.darwin)
      : undefined;
    message.freebsd = (object.freebsd !== undefined && object.freebsd !== null)
      ? XattrData.fromPartial(object.freebsd)
      : undefined;
    message.netbsd = (object.netbsd !== undefined && object.netbsd !== null)
      ? XattrData.fromPartial(object.netbsd)
      : undefined;
    return message;
  },
};

function createBaseUnixData(): UnixData {
  return { ownerName: "", groupName: "", uid: 0, gid: 0 };
}

export const UnixData = {
  encode(message: UnixData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerName !== "") {
      writer.uint32(10).string(message.ownerName);
    }
    if (message.groupName !== "") {
      writer.uint32(18).string(message.groupName);
    }
    if (message.uid !== 0) {
      writer.uint32(24).int32(message.uid);
    }
    if (message.gid !== 0) {
      writer.uint32(32).int32(message.gid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnixData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnixData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ownerName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groupName = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.uid = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.gid = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UnixData {
    return {
      ownerName: isSet(object.ownerName) ? globalThis.String(object.ownerName) : "",
      groupName: isSet(object.groupName) ? globalThis.String(object.groupName) : "",
      uid: isSet(object.uid) ? globalThis.Number(object.uid) : 0,
      gid: isSet(object.gid) ? globalThis.Number(object.gid) : 0,
    };
  },

  toJSON(message: UnixData): unknown {
    const obj: any = {};
    if (message.ownerName !== "") {
      obj.ownerName = message.ownerName;
    }
    if (message.groupName !== "") {
      obj.groupName = message.groupName;
    }
    if (message.uid !== 0) {
      obj.uid = Math.round(message.uid);
    }
    if (message.gid !== 0) {
      obj.gid = Math.round(message.gid);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UnixData>, I>>(base?: I): UnixData {
    return UnixData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UnixData>, I>>(object: I): UnixData {
    const message = createBaseUnixData();
    message.ownerName = object.ownerName ?? "";
    message.groupName = object.groupName ?? "";
    message.uid = object.uid ?? 0;
    message.gid = object.gid ?? 0;
    return message;
  },
};

function createBaseWindowsData(): WindowsData {
  return { ownerName: "", ownerIsGroup: false };
}

export const WindowsData = {
  encode(message: WindowsData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerName !== "") {
      writer.uint32(10).string(message.ownerName);
    }
    if (message.ownerIsGroup !== false) {
      writer.uint32(16).bool(message.ownerIsGroup);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WindowsData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWindowsData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ownerName = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ownerIsGroup = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WindowsData {
    return {
      ownerName: isSet(object.ownerName) ? globalThis.String(object.ownerName) : "",
      ownerIsGroup: isSet(object.ownerIsGroup) ? globalThis.Boolean(object.ownerIsGroup) : false,
    };
  },

  toJSON(message: WindowsData): unknown {
    const obj: any = {};
    if (message.ownerName !== "") {
      obj.ownerName = message.ownerName;
    }
    if (message.ownerIsGroup !== false) {
      obj.ownerIsGroup = message.ownerIsGroup;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WindowsData>, I>>(base?: I): WindowsData {
    return WindowsData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WindowsData>, I>>(object: I): WindowsData {
    const message = createBaseWindowsData();
    message.ownerName = object.ownerName ?? "";
    message.ownerIsGroup = object.ownerIsGroup ?? false;
    return message;
  },
};

function createBaseXattrData(): XattrData {
  return { xattrs: [] };
}

export const XattrData = {
  encode(message: XattrData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.xattrs) {
      Xattr.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): XattrData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseXattrData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.xattrs.push(Xattr.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): XattrData {
    return { xattrs: globalThis.Array.isArray(object?.xattrs) ? object.xattrs.map((e: any) => Xattr.fromJSON(e)) : [] };
  },

  toJSON(message: XattrData): unknown {
    const obj: any = {};
    if (message.xattrs?.length) {
      obj.xattrs = message.xattrs.map((e) => Xattr.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<XattrData>, I>>(base?: I): XattrData {
    return XattrData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<XattrData>, I>>(object: I): XattrData {
    const message = createBaseXattrData();
    message.xattrs = object.xattrs?.map((e) => Xattr.fromPartial(e)) || [];
    return message;
  },
};

function createBaseXattr(): Xattr {
  return { name: "", value: new Uint8Array(0) };
}

export const Xattr = {
  encode(message: Xattr, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Xattr {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseXattr();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Xattr {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      value: isSet(object.value) ? bytesFromBase64(object.value) : new Uint8Array(0),
    };
  },

  toJSON(message: Xattr): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Xattr>, I>>(base?: I): Xattr {
    return Xattr.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Xattr>, I>>(object: I): Xattr {
    const message = createBaseXattr();
    message.name = object.name ?? "";
    message.value = object.value ?? new Uint8Array(0);
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToBigint(long: Long) {
  return BigInt(long.toString());
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
