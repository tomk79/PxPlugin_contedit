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

		$sitemap = $this->px->site()->get_sitemap();

		if( !count($sitemap) ){
			$src .= '<p class="error">サイトマップにページが登録されていません。</p>'."\n";
		}else{
			$src .= '<div class="unit">'."\n";
			$src .= '<ul>'."\n";
			foreach( $sitemap as $path=>$page_info ){
				$path_content = $this->plugin_obj->get_content_file_info($page_info);
				$src .= '	<li>'.t::h( $page_info['title'] );
				if( is_file($path_content['path']) ){
					$src .= ' <a href="'.t::h( $this->px->theme()->href( $page_info['path'] ).'?PX=plugins.contedit.edit' ).'">編集する</a>';
				}
				$src .= '</li>'."\n";
			}
			$src .= '</ul>'."\n";
			$src .= '</div>'."\n";
		}

		return $src;
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
