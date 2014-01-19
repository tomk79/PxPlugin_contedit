<?php

/**
 * contedit modParser
 */
class pxplugin_contedit_helpers_modParser{
	private $element_id_index = 1;

	/**
	 * コンストラクタ
	 */
	public function __construct(){
	}//__construct()

	public function parse( $bin , $input_type = null ){
		if( !strlen( $input_type ) ){
				// $input_type (入力の種類)を省略したら、自動的に判断する。
			if( @is_file( $bin ) ){
				$input_type = 'path';
			}else{
				$input_type = 'bin';
			}
		}
		if( $input_type == 'path' ){
			// 指定されたのがパスだったら開く
			$bin = @file_get_contents( $bin );
		}

		$rtn = array();

		while(1){
			if( !preg_match('/^(.*?)\{([a-zA-Z0-9]+?)(?:\s+(.+?))?\}(.*)$/s', $bin, $matched) ){
				if( strlen($bin) ){
					array_push( $rtn, $this->create_text_node( $bin ) );
				}
				break;
			}
			$elm = array();
			$idx = 1;
			$elm['before']     = $matched[$idx++];
			$elm['func']       = trim($matched[$idx++]);
			$elm['attribute_src'] = trim($matched[$idx++]);
			$elm['attributes'] = $this->parse_attributes( $elm['attribute_src'] );
			$elm['after']      = $matched[$idx++];

			if( strlen($elm['before']) ){
				array_push( $rtn, $this->create_text_node( $elm['before'] ) );
			}
			$children = $this->search_close_tag($elm['after'], $elm['func']);
			$bin = $children['after'];

			array_push( $rtn, $this->create_template_node( $elm['func'], $elm['attributes'], $children['inner'] ) );
			continue;
		}

		return $rtn;
	}

	/**
	 * 属性情報をパースする。
	 */
	private function parse_attributes( $strings ){
		#	属性の種類
		$rnsp = '(?:\r\n|\r|\n| |\t)';
		$prop = '(?:[a-z0-9A-Z_-]+\:)?[a-z0-9A-Z_-]+';
		$typeA = '([\'"]?)(.*?)\3';	#	ダブルクオートあり
		$typeB = '[^"\' ]+';		#	ダブルクオートなし

		#	属性指定の式
		$prop_exists = '/'.$rnsp.'*('.$prop.')(?:\=(?:('.$typeB.')|'.$typeA.'))?'.$rnsp.'*/s';

		preg_match_all( $prop_exists , $strings , $results );
		for( $i = 0; !is_null($results[0][$i]); $i++ ){
			if( !strlen($results[3][$i]) ){
				$results[4][$i] = null;
			}
			if( $results[2][$i] ){
				$RTN[strtolower( $results[1][$i] )] = $results[2][$i];
			}else{
				$RTN[strtolower( $results[1][$i] )] = $results[4][$i];
			}
		}
		return	$RTN;
	}// parse_attributes()

	/**
	 * テキストノードを作成する
	 */
	private function create_text_node($text){
		$rtn = array();
		$rtn['type']    = 'text';
		$rtn['content'] = $text;
		return $rtn;
	}// create_text_node()

	/**
	 * テンプレートノードを作成する
	 */
	private function create_template_node($method, $attr, $bin_inner){
		$rtn = array();
		$rtn['type']       = 'func';
		$rtn['func']       = $method;
		$rtn['attributes'] = $attr;

		if( strlen($rtn['attributes']['id']) ){
			$rtn['edit_element_id'] = $rtn['attributes']['id'];
		}else{
			$rtn['edit_element_id'] = 'edit_element_'.($this->element_id_index++);
		}
		$rtn['children']   = $this->parse($bin_inner);

		return $rtn;
	}// create_text_node()

	/**
	 * 閉じタグを探す
	 */
	private function search_close_tag( $bin, $function_name ){
		// UTODO: 入れ子が1階層までしか処理できていない。深さの計算処理を追加する。

		$before = '';
		while(1){
			if( !preg_match('/^(.*?)\{(\/)('.preg_quote($function_name, '/').')(?:\s+(.+?))?\}(.*)$/s', $bin, $matched) ){
				$before .= $bin;
				$bin = '';
				break;
			}
			$elm = array();
			$idx = 1;
			$elm['before']     = $matched[$idx++];
			$elm['close_tag']  = trim($matched[$idx++]);
			$elm['func']       = trim($matched[$idx++]);
			$elm['attribute_src'] = trim($matched[$idx++]);
			$elm['after']      = $matched[$idx++];

			$before .= $elm['before'];
			$bin = $elm['after'];
			if( strlen($elm['close_tag']) ){
				// 閉じタグを発見した。
				break;
			}else{
				$before .= '{'.$elm['func'].' '.$elm['attribute_src'].'}';
			}
			continue;
		}

		$rtn = array();
		if( strlen($before) && strlen($bin) ){
			$rtn['inner'] = $before;
			$rtn['after'] = $bin;
		}else{
			$rtn['inner'] = '';
			$rtn['after'] = $before;
		}
		return $rtn;
	}

}

?>