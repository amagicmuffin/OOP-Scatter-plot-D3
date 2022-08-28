TODO

class Scatter {
	data;
	sizes;
	labels;

/**
data
sizes: {m_top:, m_right:, m_bottom:, m_left:, width:, height:} //m = margin
labels: {draw_on:, x_col_name, y_col_name, size_col_name, x_col_label, y_col_label} // names as they appear in file, labels are optional
*/
	constructor(data, sizes, labels) {
		this.path_to_data = data;
		
		//maybe something like this to "expand" the objects?
		this.x_col_label = labels[x_col_label]
	}
}