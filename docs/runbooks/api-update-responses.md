[🔙](../../README.md#runbooks)

# API: Update Responses

Whenever back-end developers change their API's JSON response structure, then our app won't be able to map the response properly as it was doing it before.

## Just changed the schema

In such case, we need to update our corresponding proxy layer ('_map_' lib). Here are the steps to do so:

- Update the corresponding '_map_' lib + its interfaces.  
  **Tip!** If in the API docs, backend developers mention that a property is nullable, it's the best to consider 2 scenarios for this: (1) The property itself may not exist at all, (2) It will exist whatsoever, but its value can be `null`. So we can define our own interfaces (mapped & original API interfaces) based on these 2 probable scenarios. e.g., `param_name` property is nullable in the API docs, so our API interface define this property like this: `param_name?: 'sth' | null;`, and our map interface defines it lie this: `paramName?: 'sth';`.

## A property is added/removed in API response schema

Whenever back-end developers add/remove a property in their API's JSON response structure, then our app may need to know about that property to show more info in the UI. Here are the steps to do so:

- Update the corresponding '_map_' lib + its interfaces.
- Update the corresponding '_data-access_' lib.
- In '_NX Console_' extension: Focus on the newly modified '_data-access_' lib in NX Graph, to see what '_feature_'/'_page_' libs are dependant to it.
- Update the dependant '_feature_'/'_page_' libs (+ probable dependant '_ui_'/'_util_' libs).

[🔙](../../README.md#runbooks)
