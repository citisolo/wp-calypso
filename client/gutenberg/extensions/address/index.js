/** @format */
/**
 * External dependencies
 */
import { Path, Circle } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import edit from './edit';
import renderMaterialIcon from 'gutenberg/extensions/presets/jetpack/utils/render-material-icon';

const attributes = {
	address: {
		type: 'string',
		default: '',
	},
	address_line2: {
		type: 'string',
		default: '',
	},
	address_line3: {
		type: 'string',
		default: '',
	},
	city: {
		type: 'string',
		default: '',
	},
	region: {
		type: 'string',
		default: '',
	},
	postal: {
		type: 'string',
		default: '',
	},
	country: {
		type: 'string',
		default: '',
	},
};

const save = ( {
	attributes: { address, address_line2, address_line3, city, region, postal, country },
	className,
} ) => (
	<div
		className={ className }
		itemprop="address"
		itemscope
		itemtype="http://schema.org/PostalAddress"
	>
		{ address && <div itemprop="streetAddress">{ address }</div> }
		{ address_line2 && <div itemprop="streetAddress">{ address_line2 }</div> }
		{ address_line3 && <div itemprop="streetAddress">{ address_line3 }</div> }
		{ city && ! ( region || postal ) && <div itemprop="addressLocality">{ city }</div> }
		{ city &&
			( region || postal ) && (
				<div>
					{ [
						<span itemprop="addressLocality">city</span>,
						', ',
						<span itemprop="addressRegion">region</span>,
						<span itemprop="addressPostal">postal</span>,
					] }
				</div>
			) }
		{ ! city &&
			( region || postal ) && (
				<div>
					{ [
						<span itemprop="addressRegion">region</span>,
						<span itemprop="addressPostal">postal</span>,
					] }
				</div>
			) }
		{ country && <div itemprop="addressCountry">{ country }</div> }
	</div>
);

export const name = 'address';

export const settings = {
	title: 'Address',
	icon: renderMaterialIcon(
		<Fragment>
			<Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
			<Circle cx="12" cy="9" r="2.5" />
		</Fragment>
	),
	category: 'jetpack',
	attributes,
	parent: [ 'jetpack/contact-info' ],
	edit,
	save,
};
