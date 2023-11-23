import * as React from 'react';
import {
	GetHeadConfig,
	GetPath,
	GetRedirects,
	HeadConfig,
	Template,
	TemplateConfig,
	TemplateProps,
	TemplateRenderProps,
	TransformProps,
} from '@yext/pages';
import { isProduction } from '@yext/pages/util';
import '../index.css';
import Favicon from '../assets/images/yext-favicon.ico';
import Banner from '../components/Banner';
import DirectoryCityGrid from '../components/DirectoryCityGrid';
import PageLayout from '../components/PageLayout';
import EditTool from '../components/EditTool';
import Breadcrumbs from '../components/Breadcrumbs';
import Apis from '../utils/Apis';

export const config: TemplateConfig = {
	stream: {
		$id: 'city-stream',
		filter: {
			entityTypes: ['ce_city'],
		},
		fields: [
			'id',
			'uid',
			'meta',
			'name',
			'description',
			'slug',
			'c_addressRegionDisplayName',
			'dm_directoryParents.name',
			'dm_directoryParents.slug',
			'dm_directoryParents.meta',
			'dm_directoryParents.c_addressRegionDisplayName',
			'dm_directoryChildren.name',
			'dm_directoryChildren.address',
			'dm_directoryChildren.mainPhone',
			'dm_directoryChildren.slug',
		],
		localization: {
			locales: ['en'],
			primary: false,
		},
	},
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
	return `${document.slug.toString()}`;
};

export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
	return [`alias/${document.locale}/${document.id.toString()}`];
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
	document,
}): HeadConfig => {
	return {
		title: document.name,
		charset: 'UTF-8',
		viewport: 'width=device-width, initial-scale=1',
		tags: [
			{
				type: 'link',
				attributes: {
					rel: 'icon',
					type: 'image/x-icon',
					href: Favicon,
				},
			},
		],
	};
};

export const transformProps: TransformProps<any> = async (data) => {
	const { dm_directoryParents, name, slug } = data.document;
	const [footer, header, mobileFooter] = await Promise.all([
		Apis.getDesktopFooter(),
		Apis.getHeaderMenuNav(),
		Apis.getMobileFooter(),
	]);

	(dm_directoryParents || []).push({ name: name, slug: '' });

	return {
		...data,
		document: {
			...data.document,
			dm_directoryParents: dm_directoryParents,
			header: header || [],
			footer: footer || [],
			mobileFooter: mobileFooter || [],
		},
	};
};

const City: Template<TemplateRenderProps> = ({
	relativePrefixToRoot,
	document,
}) => {
	const {
		name,
		description,
		siteDomain,
		slug,
		dm_directoryParents,
		dm_directoryChildren,
	} = document;

	return (
		<>
			<PageLayout
				header={document?.header}
				footer={document?.footer}
				mobileFooter={document?.mobileFooter}>
				<div className='centered-container'>
					<Breadcrumbs
						breadcrumbs={dm_directoryParents}
						baseUrl={relativePrefixToRoot}
					/>
					<h1>{name}</h1>
					<DirectoryCityGrid
						name={name}
						description={description}
						slug={slug}
						directoryChildren={dm_directoryChildren}
						relativePrefixToRoot={relativePrefixToRoot}
					/>
				</div>
			</PageLayout>
		</>
	);
};

export default City;
