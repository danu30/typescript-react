import { BaseAction } from './AsyncActionSet';

import ArraySyncReducer, {
	ISyncArrayReducer
} from './reducers/SyncArrayReducer';

type SetHandler<T> = (payload: T) => BaseAction<T>;
type AppendHandler<T> = (payload: T) => BaseAction<T>;
type RemoveHandler<T> = (payload: T) => BaseAction<T>;

interface ArrayActionStateHandlers<T> {
	set: SetHandler<T[]>;
	append: AppendHandler<T>;
	remove: RemoveHandler<T>;
}

export interface ArrayActionState<T> {
	set: string;
	append: string;
	remove: string;
	handlers: ArrayActionStateHandlers<T>;
	reducer: (
		state: ISyncArrayReducer<T> | undefined,
		action: any
	) => ISyncArrayReducer<T>;
}

export interface ActionState<T> {
	set: string;
}

export default abstract class ActionSet<
	ActionSetSchema extends {
		[key: string]: ArrayActionState<any>;
	}
> {
	private static joinWithUpperCase(...words: string[]) {
		return words.join('_').toUpperCase();
	}

	private static lowerCaseFirstChar(word: string) {
		return word.charAt(0).toLowerCase() + word.slice(1);
	}

	public readonly allStates: ActionSetSchema = {} as ActionSetSchema;

	private readonly arrayActionTypes: string[] = ['SET', 'APPEND', 'REMOVE'];
	// private readonly actionTypes: string[] = ['SET'];

	protected constructor(protected readonly identifier: string) {}

	protected set states(states: string[]) {
		for (const state of states) {
			const camelCasedState = ActionSet.lowerCaseFirstChar(state);

			console.log(camelCasedState);
		}
	}

	protected set arrayStates(states: string[]) {
		for (const state of states) {
			const camelCasedState = ActionSet.lowerCaseFirstChar(state);

			this.allStates[camelCasedState] = {
				set: '',
				append: '',
				remove: '',
				handlers: {} as ArrayActionStateHandlers<any>,
				reducer: undefined as any
			};

			for (const type of this.arrayActionTypes) {
				const value = ActionSet.joinWithUpperCase(
					this.identifier,
					state,
					type
				);

				// @ts-ignore
				this.allStates[camelCasedState][type.toLowerCase()] = value;
				// @ts-ignore
				this.allStates[camelCasedState].handlers[type.toLowerCase()] = <
					P
				>(
					payload: P
				) => ({
					type: value,
					payload
				});

				this.allStates[camelCasedState].reducer = this.ArraySyncReducer(
					camelCasedState
				);
			}
		}
	}

	// @ts-ignore
	private ArraySyncReducer<P>(
		prefix: string,
		initial?: ISyncArrayReducer<P>
	) {
		return ArraySyncReducer<ActionSet<ActionSetSchema>, P>(
			this,
			prefix,
			initial
		);
	}
}
