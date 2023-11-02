/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	DefaultUsers = "default_users",
	Message = "message",
	OldUser = "old_user",
	QueuedUser = "queued_user",
	Session = "session",
	User = "user",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type DefaultUsersRecord = {
	avatar?: string
	name?: string
}

export type MessageRecord = {
	content: string
	sender: RecordIdString
}

export type OldUserRecord<Tinterests = unknown> = {
	has_match?: boolean
	interests: null | Tinterests
}

export type QueuedUserRecord = {
	user: RecordIdString
}

export type SessionRecord = {
	messages?: RecordIdString[]
}

export type UserRecord<Tinterests = unknown> = {
	client_id?: string
	has_match?: boolean
	interests?: null | Tinterests
	is_connected?: boolean
	session_id?: string
}

// Response types include system fields and match responses from the PocketBase API
export type DefaultUsersResponse<Texpand = unknown> = Required<DefaultUsersRecord> & AuthSystemFields<Texpand>
export type MessageResponse<Texpand = unknown> = Required<MessageRecord> & BaseSystemFields<Texpand>
export type OldUserResponse<Tinterests = unknown, Texpand = unknown> = Required<OldUserRecord<Tinterests>> & BaseSystemFields<Texpand>
export type QueuedUserResponse<Texpand = unknown> = Required<QueuedUserRecord> & BaseSystemFields<Texpand>
export type SessionResponse<Texpand = unknown> = Required<SessionRecord> & BaseSystemFields<Texpand>
export type UserResponse<Tinterests = unknown, Texpand = unknown> = Required<UserRecord<Tinterests>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	default_users: DefaultUsersRecord
	message: MessageRecord
	old_user: OldUserRecord
	queued_user: QueuedUserRecord
	session: SessionRecord
	user: UserRecord
}

export type CollectionResponses = {
	default_users: DefaultUsersResponse
	message: MessageResponse
	old_user: OldUserResponse
	queued_user: QueuedUserResponse
	session: SessionResponse
	user: UserResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'default_users'): RecordService<DefaultUsersResponse>
	collection(idOrName: 'message'): RecordService<MessageResponse>
	collection(idOrName: 'old_user'): RecordService<OldUserResponse>
	collection(idOrName: 'queued_user'): RecordService<QueuedUserResponse>
	collection(idOrName: 'session'): RecordService<SessionResponse>
	collection(idOrName: 'user'): RecordService<UserResponse>
}
