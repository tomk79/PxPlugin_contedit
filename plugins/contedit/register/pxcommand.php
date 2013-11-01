<?php
$this->load_px_class('/bases/pxcommand.php');

/**
 * PX Plugin "contedit"
 */
class pxplugin_contedit_register_pxcommand extends px_bases_pxcommand{

	private $command;
	private $plugin_obj;

	/**
	 * コンストラクタ
	 * @param $command = PXコマンド配列
	 * @param $px = PxFWコアオブジェクト
	 */
	public function __construct( $command , $px ){
		parent::__construct( $command , $px );
		$this->command = $this->get_command();
		$this->plugin_obj = $this->px->get_plugin_object( 'contedit' );

		print $this->html_template( $this->start() );
		exit;
	}


	/**
	 * コンテンツ内へのリンク先を調整する。
	 */
	private function href( $linkto = null ){
		return $this->plugin_obj->href( $linkto );
	}

	/**
	 * コンテンツ内へのリンクを生成する。
	 */
	private function mk_link( $linkto , $options = array() ){
		return $this->plugin_obj->mk_link( $linkto , $options );
	}

	// ------------------------------------------------------------------------------------------------------------------

	/**
	 * 処理の開始
	 */
	private function start(){
		if( $this->command[2] == 'edit' ){
			return $this->page_edit_content();
		}
		return $this->page_homepage();
	}

	/**
	 * ホームページを表示する。
	 */
	private function page_homepage(){

		$src = '';
		$src .= '<p>コンテンツを編集するプラグインです。</p>'."\n";
		$src .= ''."\n";

		$top_page_info = $this->px->site()->get_page_info('');

		if( !count($top_page_info) ){
			$src .= '<p class="error">サイトマップにトップページが登録されていません。</p>'."\n";
		}else{
			$src .= '<div class="unit">'."\n";
			$src .= '	<ul>'."\n";
			$src .= '		<li>'.t::h( $top_page_info['title'] );
			$src .= ' <a href="'.t::h( $this->px->theme()->href( $top_page_info['path'].'?PX=plugins.contedit.edit' ) ).'">編集する</a>';
			$src .= $this->mk_sitemap_tree($top_page_info, array('filter'=>false));
			$src .= '		</li>'."\n";
			$src .= '	</ul>'."\n";
			$src .= '</div>'."\n";
		}

		return $src;
	}
	/**
	 * サイトマップツリーを作る
	 */
	private function mk_sitemap_tree( $parent_page_info ){
		if(!is_array($parent_page_info)){return '';}
		$children = $this->px->site()->get_children( $parent_page_info['id'], array('filter'=>false) );
		if( !count($children) ){ return ''; }

		$rtn = '';
		$rtn .= '<ul>'."\n";
		foreach( $children as $child ){
			$page_info = $this->px->site()->get_page_info( $child );
			$rtn .= '<li>'.t::h($page_info['title']);
			$rtn .= ' <a href="'.t::h( $this->px->theme()->href( $page_info['path'].'?PX=plugins.contedit.edit' ) ).'">編集する</a>';
			$rtn .= $this->mk_sitemap_tree($page_info);
			$rtn .= '</li>';
		}
		$rtn .= '</ul>'."\n";
		return $rtn;
	}


	/**
	 * コンテンツを編集する。
	 */
	private function page_edit_content(){
		$current_page_info = $this->px->site()->get_current_page_info();

		// ↓編集画面を起動する。
		$obj = $this->plugin_obj->factory_editor( $current_page_info );
		return $obj->execute();
	}

}

?>
