interface Body<TVariables> {
    query: string;
    variables?: TVariables;
}

export const server = {
    fetch: async <TData = any, TVariables = any >(body: Body<TVariables>) => {
        const res = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error('failed to fetch from server.')
        }
        
        // now; it know which kind of data types exist in graphql.
        return res.json() as Promise<{ data: TData, errors: Error[] }>;
    }
};