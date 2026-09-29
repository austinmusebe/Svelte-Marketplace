export const load = ({ url }) => {
	const category = url.searchParams.get('category') || 'All';
	const search = url.searchParams.get('search') || '';
	return { category, search };
};
